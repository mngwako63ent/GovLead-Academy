import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.VERCEL ? '/tmp/govlead.db' : 'govlead.db';
console.log(`Initializing database at: ${dbPath}`);
const db = new Database(dbPath);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    subscription_status TEXT DEFAULT 'free',
    onboarding_preferences TEXT,
    bio TEXT,
    profile_image TEXT,
    business_info TEXT,
    learning_interests TEXT,
    experience_level TEXT,
    business_stage TEXT,
    email_verified BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add columns if they don't exist (for existing databases)
const columns = [
  'bio TEXT',
  'profile_image TEXT',
  'business_info TEXT',
  'learning_interests TEXT',
  'experience_level TEXT',
  'business_stage TEXT',
  'email_verified BOOLEAN DEFAULT 1'
];

const courseColumns = [
  'is_paid BOOLEAN DEFAULT 0',
  'price REAL DEFAULT 0',
  'learning_outcomes TEXT',
  'syllabus_url TEXT'
];

const lessonColumns = [
  'document_url TEXT'
];

lessonColumns.forEach(col => {
  try {
    db.exec(`ALTER TABLE lessons ADD COLUMN ${col};`);
  } catch (e) {
    // Column likely already exists
  }
});

columns.forEach(col => {
  try {
    db.exec(`ALTER TABLE users ADD COLUMN ${col};`);
  } catch (e) {
    // Column likely already exists
  }
});

courseColumns.forEach(col => {
  try {
    db.exec(`ALTER TABLE courses ADD COLUMN ${col};`);
  } catch (e) {
    // Column likely already exists
  }
});

db.exec(`
  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    course_id INTEGER,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    lesson_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(lesson_id) REFERENCES lessons(id)
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    user_id INTEGER,
    course_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, course_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    slug TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    category_id INTEGER,
    difficulty TEXT,
    thumbnail_url TEXT,
    syllabus_url TEXT,
    status TEXT DEFAULT 'draft',
    is_paid BOOLEAN DEFAULT 0,
    price REAL DEFAULT 0,
    learning_outcomes TEXT, -- JSON array of strings
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    title TEXT,
    order_index INTEGER,
    FOREIGN KEY(course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER,
    title TEXT,
    video_url TEXT,
    document_url TEXT,
    duration INTEGER,
    order_index INTEGER,
    content_markdown TEXT,
    FOREIGN KEY(module_id) REFERENCES modules(id)
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    user_id INTEGER,
    lesson_id INTEGER,
    completed BOOLEAN DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    last_watched_timestamp DATETIME,
    PRIMARY KEY(user_id, lesson_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(lesson_id) REFERENCES lessons(id)
  );

  -- Seed Data
  INSERT OR IGNORE INTO users (name, email, password, role) VALUES ('Alex Rivera', 'alex@example.com', 'password123', 'user');
  INSERT OR IGNORE INTO users (name, email, password, role) VALUES ('Admin User', 'admin@govlead.com', 'admin123', 'admin');
  
  INSERT OR IGNORE INTO categories (name, slug) VALUES ('Strategy / Leadership', 'strategy-leadership');
  INSERT OR IGNORE INTO categories (name, slug) VALUES ('AI', 'ai');
  INSERT OR IGNORE INTO categories (name, slug) VALUES ('Scaling', 'scaling');
  INSERT OR IGNORE INTO categories (name, slug) VALUES ('Branding', 'branding');

  -- Cleanup old mock courses
  DELETE FROM courses WHERE title IN ('AI-Driven Business Systems', 'Scaling to 7 Figures', 'Premium Brand Authority', 'Leadership Operating System');
`);

const seedCoreCourses = () => {
  const strategyCategory = db.prepare("SELECT id FROM categories WHERE slug = 'strategy-leadership'").get();
  if (!strategyCategory) return;

  const coreCourses = [
    {
      title: "Building Your Strategic Foundation",
      description: "Build clarity around your internal drivers, long-term direction, and financial thresholds. This course establishes the strategic spine of your business.",
      modules: [
        "Vision vs Mission vs Objectives",
        "Strategic Intent & Long-Term Direction",
        "Financial Hurdles vs Business Objectives",
        "Shareholders vs Stakeholders",
        "Leadership Alignment Around Purpose"
      ],
      outcomes: ["Define clear business vision and mission", "Understand strategic intent", "Set financial hurdles", "Align leadership team"]
    },
    {
      title: "Understanding Your Market & Industry Structure",
      description: "Analyze the external environment to identify opportunities and threats. Learn to navigate industry forces and competitive dynamics.",
      modules: [
        "Macro Environment Analysis (PESTEL)",
        "Industry Life Cycle & Evolution",
        "Porter's Five Forces Framework",
        "Competitor Analysis & Benchmarking",
        "Identifying Strategic Groups"
      ],
      outcomes: ["Conduct PESTEL analysis", "Evaluate industry life cycles", "Apply Porter's Five Forces", "Analyze competitors"]
    },
    {
      title: "Deep Customer Strategy Masterclass",
      description: "Master the art of customer-centric growth. Understand customer needs, behaviors, and decision-making processes to build lasting relationships.",
      modules: [
        "The Customer Decision Journey",
        "Jobs to be Done Framework",
        "Customer Persona Development",
        "Empathy Mapping & Insight Generation",
        "Analyzing Customer Pain Points"
      ],
      outcomes: ["Map customer decision journeys", "Apply Jobs to be Done", "Create detailed personas", "Generate customer insights"]
    },
    {
      title: "Segmentation & Targeting for Profitable Growth",
      description: "Learn how to divide your market into meaningful segments and choose the most profitable ones to target with precision.",
      modules: [
        "Bases for Market Segmentation",
        "Evaluating Segment Attractiveness",
        "Selecting Target Segments",
        "Niche vs Mass Market Strategies",
        "Dynamic Segmentation Models"
      ],
      outcomes: ["Segment markets effectively", "Assess segment profitability", "Develop targeting strategies", "Understand niche dynamics"]
    },
    {
      title: "Positioning & Brand Power Strategy",
      description: "Create a unique space in your customers' minds. Build a powerful brand that stands out and commands a premium.",
      modules: [
        "Developing a Unique Value Proposition",
        "Positioning Maps & Perceptual Mapping",
        "Brand Identity & Personality",
        "Crafting the Positioning Statement",
        "Brand Equity & Awareness"
      ],
      outcomes: ["Craft unique value propositions", "Create positioning maps", "Define brand identity", "Write positioning statements"]
    },
    {
      title: "Customer Retention & Lifetime Value Strategy",
      description: "Focus on keeping the customers you have. Learn strategies to increase loyalty, reduce churn, and maximize lifetime value.",
      modules: [
        "Calculating Customer Lifetime Value (CLV)",
        "Strategies for Reducing Churn",
        "Loyalty Programs & Incentives",
        "Building Customer Communities",
        "Feedback Loops & Continuous Improvement"
      ],
      outcomes: ["Calculate CLV", "Implement retention strategies", "Design loyalty programs", "Build customer communities"]
    },
    {
      title: "Designing Powerful Market Offerings",
      description: "Design products and services that solve real problems. Learn to bundle features and benefits into compelling market offerings.",
      modules: [
        "Product/Service Design Principles",
        "Bundling & Pricing Strategies",
        "Service Excellence & Experience Design",
        "Innovation & New Product Development",
        "Managing the Product Portfolio"
      ],
      outcomes: ["Design compelling offerings", "Develop pricing strategies", "Create service experiences", "Manage product portfolios"]
    },
    {
      title: "Organising for Market Success",
      description: "Align your internal structure with your market strategy. Build the right teams and processes to deliver exceptional value.",
      modules: [
        "Organizational Structure & Design",
        "Building High-Performance Teams",
        "Process Optimization & Efficiency",
        "Culture as a Strategic Asset",
        "Managing Change & Transformation"
      ],
      outcomes: ["Design effective organizations", "Build high-performance teams", "Optimize business processes", "Leverage company culture"]
    },
    {
      title: "SCORPIO Strategic Coordination Blueprint",
      description: "A proprietary framework for coordinating all aspects of your business strategy for maximum impact and synergy.",
      modules: [
        "Introduction to SCORPIO Framework",
        "Strategic Alignment & Integration",
        "Resource Allocation & Optimization",
        "Performance Monitoring & Control",
        "Scaling with SCORPIO"
      ],
      outcomes: ["Apply SCORPIO framework", "Coordinate strategic activities", "Optimize resource use", "Monitor performance effectively"]
    },
    {
      title: "From Strategy to Implementation",
      description: "Turn your strategic plans into reality. Learn the tools and techniques for effective execution and project management.",
      modules: [
        "Setting SMART Objectives",
        "Action Planning & Roadmapping",
        "Project Management Fundamentals",
        "Overcoming Implementation Barriers",
        "Measuring Success & Iterating"
      ],
      outcomes: ["Set SMART objectives", "Create strategic roadmaps", "Apply project management", "Execute strategy effectively"]
    }
  ];

  for (const course of coreCourses) {
    const existing = db.prepare("SELECT id FROM courses WHERE title = ?").get(course.title);
    if (!existing) {
      const info = db.prepare(`
        INSERT INTO courses (title, description, category_id, difficulty, status, learning_outcomes, thumbnail_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        course.title,
        course.description,
        strategyCategory.id,
        'Intermediate',
        'published',
        JSON.stringify(course.outcomes),
        `https://picsum.photos/seed/${course.title.replace(/\s/g, '')}/800/450`
      );

      const courseId = info.lastInsertRowid;
      course.modules.forEach((moduleTitle, index) => {
        const modInfo = db.prepare("INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)").run(courseId, moduleTitle, index + 1);
        const moduleId = modInfo.lastInsertRowid;
        
        // Add a dummy lesson for each module
        db.prepare("INSERT INTO lessons (module_id, title, video_url, duration, order_index) VALUES (?, ?, ?, ?, ?)")
          .run(moduleId, `Introduction to ${moduleTitle}`, "https://www.youtube.com/embed/dQw4w9WgXcQ", 15, 1);
      });
    }
  }
};

seedCoreCourses();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Mock Auth for now
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (user) {
      if (user.password === password) {
        res.json({ user });
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      res.status(401).json({ error: 'User not found' });
    }
  });

  app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;
    try {
      const info = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email, password, 'user');
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
      res.json({ user });
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create account: ' + error.message });
      }
    }
  });

  app.get('/api/courses', (req, res) => {
    const userId = req.headers['x-user-id'];
    const courses = db.prepare("SELECT * FROM courses WHERE status = 'published'").all();
    
    const coursesWithProgress = courses.map(course => {
      let progress = undefined;
      if (userId) {
        const enrollment = db.prepare('SELECT 1 FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, course.id);
        if (enrollment) {
          const totalLessons = db.prepare(`
            SELECT COUNT(l.id) as count 
            FROM lessons l 
            JOIN modules m ON l.module_id = m.id 
            WHERE m.course_id = ?
          `).get(course.id).count;

          const completedLessons = db.prepare(`
            SELECT COUNT(up.lesson_id) as count 
            FROM user_progress up 
            JOIN lessons l ON up.lesson_id = l.id 
            JOIN modules m ON l.module_id = m.id 
            WHERE m.course_id = ? AND up.user_id = ? AND up.completed = 1
          `).get(course.id, userId).count;

          progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        }
      }
      return { ...course, progress };
    });

    res.json(coursesWithProgress);
  });

  app.get('/api/courses/:id', (req, res) => {
    const { id } = req.params;
    const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  });

  app.get('/api/courses/:id/curriculum', (req, res) => {
    const { id } = req.params;
    const modules = db.prepare("SELECT * FROM modules WHERE course_id = ? ORDER BY order_index ASC").all(id);
    const curriculum = modules.map(m => {
      const lessons = db.prepare("SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index ASC").all(m.id);
      return { ...m, lessons };
    });
    res.json(curriculum);
  });

  app.get('/api/categories', (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  // Admin Routes (Simple role check - in a real app this would use JWT/Sessions)
  const isAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
  };

  app.get('/api/admin/stats', isAdmin, (req, res) => {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
    const completionCount = db.prepare('SELECT COUNT(*) as count FROM user_progress WHERE completed = 1').get().count;
    res.json({ userCount, courseCount, completionCount });
  });

  app.get('/api/admin/users', isAdmin, (req, res) => {
    const users = db.prepare('SELECT id, name, email, role, subscription_status, created_at FROM users').all();
    res.json(users);
  });

  app.patch('/api/admin/users/:id/role', isAdmin, (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
    res.json({ success: true });
  });

  app.patch('/api/admin/users/:id/subscription', isAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE users SET subscription_status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  });

  app.delete('/api/admin/users/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const userIdToDelete = Number(id);
    const adminId = req.headers['x-user-id'];

    // Don't allow deleting yourself
    if (String(userIdToDelete) === String(adminId)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    try {
      console.log(`Admin ${adminId} attempting to delete user ${userIdToDelete}`);
      
      // Check if user exists
      const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userIdToDelete);
      if (!user) {
        console.log(`User ${userIdToDelete} not found`);
        return res.status(404).json({ error: 'User not found' });
      }

      const deleteTransaction = db.transaction(() => {
        const tables = ['enrollments', 'notes', 'bookmarks', 'user_progress'];
        tables.forEach(table => {
          const result = db.prepare(`DELETE FROM ${table} WHERE user_id = ?`).run(userIdToDelete);
          console.log(`Deleted ${result.changes} rows from ${table} for user ${userIdToDelete}`);
        });
        
        const userResult = db.prepare('DELETE FROM users WHERE id = ?').run(userIdToDelete);
        console.log(`Deleted user ${userIdToDelete} from users table. Changes: ${userResult.changes}`);
      });
      
      deleteTransaction();
      console.log(`Successfully completed deletion for user ${userIdToDelete}`);
      res.json({ success: true });
    } catch (error) {
      console.error('Failed to delete user:', error);
      res.status(500).json({ error: 'Failed to delete user and related data: ' + (error instanceof Error ? error.message : String(error)) });
    }
  });

  app.post('/api/admin/users', isAdmin, (req, res) => {
    const { name, email, password, role, subscription_status } = req.body;
    try {
      const info = db.prepare('INSERT INTO users (name, email, password, role, subscription_status) VALUES (?, ?, ?, ?, ?)').run(
        name, 
        email, 
        password, 
        role || 'user', 
        subscription_status || 'free'
      );
      const user = db.prepare('SELECT id, name, email, role, subscription_status, created_at FROM users WHERE id = ?').get(info.lastInsertRowid);
      res.json({ user });
    } catch (error: any) {
      console.error('Admin user creation error:', error);
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create user: ' + error.message });
      }
    }
  });

  app.get('/api/admin/courses', isAdmin, (req, res) => {
    const courses = db.prepare('SELECT * FROM courses').all();
    res.json(courses);
  });

  app.post('/api/admin/courses', isAdmin, (req, res) => {
    const { title, description, category_id, difficulty, thumbnail_url, syllabus_url, status, is_paid, price, learning_outcomes } = req.body;
    const info = db.prepare(`
      INSERT INTO courses (title, description, category_id, difficulty, thumbnail_url, syllabus_url, status, is_paid, price, learning_outcomes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, 
      description, 
      category_id, 
      difficulty, 
      thumbnail_url, 
      syllabus_url || '',
      status || 'draft',
      is_paid ? 1 : 0,
      price || 0,
      JSON.stringify(learning_outcomes || [])
    );
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/admin/courses/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { title, description, category_id, difficulty, thumbnail_url, syllabus_url, status, is_paid, price, learning_outcomes } = req.body;
    db.prepare(`
      UPDATE courses 
      SET title = ?, description = ?, category_id = ?, difficulty = ?, thumbnail_url = ?, syllabus_url = ?, status = ?, is_paid = ?, price = ?, learning_outcomes = ?
      WHERE id = ?
    `).run(
      title, 
      description, 
      category_id, 
      difficulty, 
      thumbnail_url, 
      syllabus_url || '',
      status, 
      is_paid ? 1 : 0,
      price || 0,
      JSON.stringify(learning_outcomes || []),
      id
    );
    res.json({ success: true });
  });

  app.delete('/api/admin/courses/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM courses WHERE id = ?').run(id);
    res.json({ success: true });
  });

  app.get('/api/admin/categories', isAdmin, (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  });

  app.post('/api/admin/upload', isAdmin, upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  app.post('/api/admin/categories', isAdmin, (req, res) => {
    const { name, slug } = req.body;
    const info = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)').run(name, slug);
    res.json({ id: info.lastInsertRowid });
  });

  app.get('/api/admin/courses/:id/lessons', isAdmin, (req, res) => {
    const { id } = req.params;
    // For now, we assume lessons are directly under courses or we find the first module
    let module = db.prepare('SELECT id FROM modules WHERE course_id = ?').get(id);
    if (!module) {
      const info = db.prepare('INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)').run(id, 'Main Module', 0);
      module = { id: info.lastInsertRowid };
    }
    const lessons = db.prepare('SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index ASC').all(module.id);
    res.json(lessons);
  });

  app.post('/api/admin/courses/:id/lessons', isAdmin, (req, res) => {
    const { id } = req.params;
    const { title, video_url, document_url, duration } = req.body;
    let module = db.prepare('SELECT id FROM modules WHERE course_id = ?').get(id);
    if (!module) {
      const info = db.prepare('INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)').run(id, 'Main Module', 0);
      module = { id: info.lastInsertRowid };
    }
    const orderIndex = db.prepare('SELECT COUNT(*) as count FROM lessons WHERE module_id = ?').get(module.id).count;
    const info = db.prepare('INSERT INTO lessons (module_id, title, video_url, document_url, duration, order_index) VALUES (?, ?, ?, ?, ?, ?)').run(
      module.id,
      title,
      video_url,
      document_url || '',
      duration || 0,
      orderIndex
    );
    res.json({ id: info.lastInsertRowid });
  });

  // Student Routes
  app.post('/api/courses/:id/enroll', (req, res) => {
    const userId = req.headers['x-user-id'];
    const { id: courseId } = req.params;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    try {
      db.prepare('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)').run(userId, courseId);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Already enrolled' });
    }
  });

  app.get('/api/my-courses', (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const courses = db.prepare(`
      SELECT c.* FROM courses c 
      JOIN enrollments e ON c.id = e.course_id 
      WHERE e.user_id = ?
    `).all(userId);

    const coursesWithProgress = courses.map(course => {
      const totalLessons = db.prepare(`
        SELECT COUNT(l.id) as count 
        FROM lessons l 
        JOIN modules m ON l.module_id = m.id 
        WHERE m.course_id = ?
      `).get(course.id).count;

      const completedLessons = db.prepare(`
        SELECT COUNT(up.lesson_id) as count 
        FROM user_progress up 
        JOIN lessons l ON up.lesson_id = l.id 
        JOIN modules m ON l.module_id = m.id 
        WHERE m.course_id = ? AND up.user_id = ? AND up.completed = 1
      `).get(course.id, userId).count;

      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      return { ...course, progress };
    });

    res.json(coursesWithProgress);
  });

  app.post('/api/lessons/:id/progress', (req, res) => {
    const userId = req.headers['x-user-id'];
    const { id: lessonId } = req.params;
    const { completed, progress_percentage } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    db.prepare(`
      INSERT INTO user_progress (user_id, lesson_id, completed, progress_percentage, last_watched_timestamp)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET
        completed = excluded.completed,
        progress_percentage = excluded.progress_percentage,
        last_watched_timestamp = CURRENT_TIMESTAMP
    `).run(userId, lessonId, completed ? 1 : 0, progress_percentage);
    res.json({ success: true });
  });

  app.get('/api/bookmarks', (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const bookmarks = db.prepare('SELECT course_id FROM bookmarks WHERE user_id = ?').all(userId);
    res.json(bookmarks);
  });

  app.post('/api/bookmarks', (req, res) => {
    const userId = req.headers['x-user-id'];
    const { courseId } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    db.prepare('INSERT OR IGNORE INTO bookmarks (user_id, course_id) VALUES (?, ?)').run(userId, courseId);
    res.json({ success: true });
  });

  app.delete('/api/bookmarks/:courseId', (req, res) => {
    const userId = req.headers['x-user-id'];
    const { courseId } = req.params;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND course_id = ?').run(userId, courseId);
    res.json({ success: true });
  });

  app.get('/api/user/dashboard-stats', (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const enrolledCount = db.prepare('SELECT COUNT(*) as count FROM enrollments WHERE user_id = ?').get(userId).count;
    
    const lessonsDone = db.prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND completed = 1').get(userId).count;
    
    // Calculate overall completion percentage
    const totalLessonsInEnrolled = db.prepare(`
      SELECT COUNT(l.id) as count 
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      JOIN enrollments e ON m.course_id = e.course_id
      WHERE e.user_id = ?
    `).get(userId).count;

    const overallCompletion = totalLessonsInEnrolled > 0 
      ? Math.round((lessonsDone / totalLessonsInEnrolled) * 100) 
      : 0;

    // Calculate certificates (completed courses)
    const completedCourses = db.prepare(`
      SELECT COUNT(*) as count FROM (
        SELECT e.course_id
        FROM enrollments e
        JOIN modules m ON e.course_id = m.course_id
        JOIN lessons l ON m.id = l.module_id
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = e.user_id
        WHERE e.user_id = ?
        GROUP BY e.course_id
        HAVING COUNT(l.id) = SUM(CASE WHEN up.completed = 1 THEN 1 ELSE 0 END)
        AND COUNT(l.id) > 0
      )
    `).get(userId).count;

    const recentCourse = db.prepare(`
      SELECT c.*, MAX(up.last_watched_timestamp) as last_access
      FROM courses c
      JOIN modules m ON c.id = m.course_id
      JOIN lessons l ON m.id = l.module_id
      JOIN user_progress up ON l.id = up.lesson_id
      WHERE up.user_id = ?
      GROUP BY c.id
      ORDER BY last_access DESC
      LIMIT 1
    `).get(userId);

    const lessonsThisWeek = db.prepare(`
      SELECT COUNT(*) as count 
      FROM user_progress 
      WHERE user_id = ? AND completed = 1 AND last_watched_timestamp >= date('now', '-7 days')
    `).get(userId).count;

    res.json({
      enrolledCount,
      lessonsDone,
      lessonsThisWeek,
      overallCompletion,
      certificates: completedCourses,
      recentCourse: recentCourse || null,
      streak: 5, // Keep mock for now or implement if needed
      roadmapStage: enrolledCount > 3 ? 'Strategy' : 'Foundation'
    });
  });

  app.get('/api/notes/:lessonId', (req, res) => {
    const userId = req.headers['x-user-id'];
    const { lessonId } = req.params;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const notes = db.prepare('SELECT * FROM notes WHERE user_id = ? AND lesson_id = ?').all(userId, lessonId);
    res.json(notes);
  });

  app.post('/api/notes', (req, res) => {
    const userId = req.headers['x-user-id'];
    const { lessonId, content } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    db.prepare('INSERT INTO notes (user_id, lesson_id, content) VALUES (?, ?, ?)').run(userId, lessonId, content);
    res.json({ success: true });
  });

  // Profile Management
  app.get('/api/profile', (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = db.prepare('SELECT id, name, email, bio, profile_image, business_info, learning_interests, experience_level, business_stage, email_verified, role, subscription_status FROM users WHERE id = ?').get(userId);
    res.json(user);
  });

  app.patch('/api/profile', (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const { 
      name = null, 
      email = null, 
      bio = null, 
      profile_image = null, 
      business_info = null, 
      learning_interests = null, 
      experience_level = null, 
      business_stage = null 
    } = req.body;
    
    const currentUser = db.prepare('SELECT email FROM users WHERE id = ?').get(userId);
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    let emailVerified = 1;
    if (email && email !== currentUser.email) {
      emailVerified = 0; // Re-verification required
    }

    try {
      db.prepare(`
        UPDATE users SET 
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          bio = COALESCE(?, bio),
          profile_image = COALESCE(?, profile_image),
          business_info = COALESCE(?, business_info),
          learning_interests = COALESCE(?, learning_interests),
          experience_level = COALESCE(?, experience_level),
          business_stage = COALESCE(?, business_stage),
          email_verified = ?
        WHERE id = ?
      `).run(
        name, 
        email, 
        bio, 
        profile_image, 
        business_info, 
        learning_interests, 
        experience_level, 
        business_stage, 
        emailVerified, 
        userId
      );
      
      const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      res.json({ user: updatedUser, emailChanged: emailVerified === 0 });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ error: 'Email already in use' });
      } else {
        res.status(500).json({ error: 'Failed to update profile' });
      }
    }
  });
  // Serve static files from public directory
  app.use(express.static(path.join(__dirname, '..', 'public')));

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Only serve index.html if it's not an API route
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        res.status(404).json({ error: 'API route not found' });
      }
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`GovLead Academy running on http://localhost:${PORT}`);
    });
  }
  
  return app;
}

const appPromise = startServer();

export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};

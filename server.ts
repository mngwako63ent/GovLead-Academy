import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.VERCEL ? '/tmp/govlead.db' : 'govlead.db';
const db = new Database(dbPath);

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
  'learning_outcomes TEXT'
];

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
  
  INSERT OR IGNORE INTO categories (name, slug) VALUES ('AI', 'ai');
  INSERT OR IGNORE INTO categories (name, slug) VALUES ('Scaling', 'scaling');
  INSERT OR IGNORE INTO categories (name, slug) VALUES ('Branding', 'branding');
  INSERT OR IGNORE INTO categories (name, slug) VALUES ('Leadership', 'leadership');

  INSERT OR IGNORE INTO courses (title, description, category_id, difficulty, thumbnail_url, status) 
  VALUES ('AI-Driven Business Systems', 'Master the art of automating your operations with cutting-edge AI tools.', 1, 'Intermediate', 'https://picsum.photos/seed/ai/800/450', 'published');
  
  INSERT OR IGNORE INTO courses (title, description, category_id, difficulty, thumbnail_url, status) 
  VALUES ('Scaling to 7 Figures', 'A blueprint for high-growth startups ready to dominate their market.', 2, 'Advanced', 'https://picsum.photos/seed/scale/800/450', 'published');

  INSERT OR IGNORE INTO courses (title, description, category_id, difficulty, thumbnail_url, status) 
  VALUES ('Premium Brand Authority', 'Build a brand that commands attention and premium pricing.', 3, 'Beginner', 'https://picsum.photos/seed/brand/800/450', 'published');

  INSERT OR IGNORE INTO courses (title, description, category_id, difficulty, thumbnail_url, status) 
  VALUES ('Leadership Operating System', 'Frameworks for building and managing high-performance teams.', 4, 'Intermediate', 'https://picsum.photos/seed/lead/800/450', 'published');
`);

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
      const info = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, password);
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
      res.json({ user });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create account' });
      }
    }
  });

  app.get('/api/courses', (req, res) => {
    const courses = db.prepare("SELECT * FROM courses WHERE status = 'published'").all();
    res.json(courses);
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

  app.get('/api/admin/courses', isAdmin, (req, res) => {
    const courses = db.prepare('SELECT * FROM courses').all();
    res.json(courses);
  });

  app.post('/api/admin/courses', isAdmin, (req, res) => {
    const { title, description, category_id, difficulty, thumbnail_url, status, is_paid, price, learning_outcomes } = req.body;
    const info = db.prepare(`
      INSERT INTO courses (title, description, category_id, difficulty, thumbnail_url, status, is_paid, price, learning_outcomes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, 
      description, 
      category_id, 
      difficulty, 
      thumbnail_url, 
      status || 'draft',
      is_paid ? 1 : 0,
      price || 0,
      JSON.stringify(learning_outcomes || [])
    );
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/admin/courses/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { title, description, category_id, difficulty, thumbnail_url, status, is_paid, price, learning_outcomes } = req.body;
    db.prepare(`
      UPDATE courses 
      SET title = ?, description = ?, category_id = ?, difficulty = ?, thumbnail_url = ?, status = ?, is_paid = ?, price = ?, learning_outcomes = ?
      WHERE id = ?
    `).run(
      title, 
      description, 
      category_id, 
      difficulty, 
      thumbnail_url, 
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
    const { title, video_url, duration } = req.body;
    let module = db.prepare('SELECT id FROM modules WHERE course_id = ?').get(id);
    if (!module) {
      const info = db.prepare('INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)').run(id, 'Main Module', 0);
      module = { id: info.lastInsertRowid };
    }
    const orderIndex = db.prepare('SELECT COUNT(*) as count FROM lessons WHERE module_id = ?').get(module.id).count;
    const info = db.prepare('INSERT INTO lessons (module_id, title, video_url, duration, order_index) VALUES (?, ?, ?, ?, ?)').run(module.id, title, video_url, duration, orderIndex);
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
    res.json(courses);
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
    
    const progressData = db.prepare(`
      SELECT SUM(l.duration) as total_minutes
      FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      WHERE up.user_id = ? AND up.completed = 1
    `).get(userId);
    
    const hoursCompleted = Math.round((progressData.total_minutes || 0) / 60);

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

    // Mocking streak and certificates for now as they aren't fully tracked in DB yet
    res.json({
      enrolledCount,
      hoursCompleted,
      streak: 5, // Mock
      certificates: 0, // Mock
      recentCourse: recentCourse || null,
      roadmapStage: enrolledCount > 3 ? 'Strategy' : 'Foundation' // Simple logic
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

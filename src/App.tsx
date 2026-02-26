/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  Search, 
  Filter, 
  PlayCircle, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Users,
  Award,
  Menu,
  X,
  ShieldCheck,
  BarChart3,
  Plus,
  Trash2,
  Edit,
  Bookmark,
  FileText,
  Lock,
  Unlock,
  Play,
  Camera,
  Mail,
  User as UserIcon,
  Briefcase,
  Target,
  Zap,
  Rocket,
  Clock,
  Flame
} from 'lucide-react';

// --- Types ---
interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  category_id?: number;
  difficulty: string;
  thumbnail: string;
  status: string;
  is_paid: boolean;
  price: number;
  learning_outcomes: string[];
  progress?: number;
}

interface CourseFormData {
  title: string;
  description: string;
  category_id: number;
  difficulty: string;
  thumbnail_url: string;
  status: string;
  is_paid: boolean;
  price: number;
  learning_outcomes: string[];
}

// --- Mock Data ---
const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: "AI-Driven Business Systems",
    description: "Master the art of automating your operations with cutting-edge AI tools.",
    category: "AI",
    difficulty: "Intermediate",
    thumbnail: "https://picsum.photos/seed/ai/800/450",
    status: "published",
    is_paid: false,
    price: 0,
    learning_outcomes: ["Automate workflows", "Implement AI agents"],
    progress: 45
  },
  {
    id: 2,
    title: "Scaling to 7 Figures",
    description: "A blueprint for high-growth startups ready to dominate their market.",
    category: "Scaling",
    difficulty: "Advanced",
    thumbnail: "https://picsum.photos/seed/scale/800/450",
    status: "published",
    is_paid: true,
    price: 99,
    learning_outcomes: ["Market domination", "High-growth strategies"],
    progress: 12
  },
  {
    id: 3,
    title: "Premium Brand Authority",
    description: "Build a brand that commands attention and premium pricing.",
    category: "Branding",
    difficulty: "Beginner",
    thumbnail: "https://picsum.photos/seed/brand/800/450",
    status: "published",
    is_paid: false,
    price: 0,
    learning_outcomes: ["Brand positioning", "Command attention"]
  },
  {
    id: 4,
    title: "Leadership Operating System",
    description: "Frameworks for building and managing high-performance teams.",
    category: "Leadership",
    difficulty: "Intermediate",
    thumbnail: "https://picsum.photos/seed/lead/800/450",
    status: "published",
    is_paid: true,
    price: 149,
    learning_outcomes: ["Team management", "High-performance frameworks"]
  }
];

// --- Components ---

const Navbar = ({ onAuthClick }: { onAuthClick: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-brand-ink/5">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-xl">G</div>
        <span className="text-xl font-bold tracking-tight text-brand-teal">GovLead Academy</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a href="#courses" className="text-sm font-medium hover:text-brand-orange transition-colors">Courses</a>
        <a href="#vision" className="text-sm font-medium hover:text-brand-orange transition-colors">Vision</a>
        <a href="#instructors" className="text-sm font-medium hover:text-brand-orange transition-colors">Instructors</a>
        <button 
          onClick={onAuthClick}
          className="px-6 py-2.5 bg-brand-teal text-white rounded-full text-sm font-semibold hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/10"
        >
          Get Started
        </button>
      </div>
      <button className="md:hidden p-2">
        <Menu className="w-6 h-6" />
      </button>
    </div>
  </nav>
);

const Hero = () => (
  <section className="pt-40 pb-20 px-6">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 bg-brand-orange/10 text-brand-orange rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          Premium Business OS
        </span>
        <h1 className="text-6xl md:text-7xl font-bold text-brand-teal leading-[1.1] mb-8">
          Build Your Business <br />
          <span className="text-brand-orange">Operating System.</span>
        </h1>
        <p className="text-xl text-brand-ink/70 max-w-lg mb-10 leading-relaxed">
          The elite platform for entrepreneurs to master AI, branding, and scaling through structured, high-impact learning.
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-brand-teal text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-xl shadow-brand-teal/20"
          >
            Explore Catalog
          </button>
          <button 
            onClick={() => document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white border border-brand-ink/10 rounded-xl font-bold hover:bg-brand-cream transition-colors"
          >
            Watch Vision
          </button>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 bg-brand-orange/5 p-4">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070" 
            alt="Platform Preview" 
            className="w-full h-full object-cover rounded-2xl -rotate-3"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Floating Top Right Element (from screenshot) */}
        <div className="absolute -top-4 -right-4 glass-card p-4 rounded-2xl premium-shadow animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest">Live Workshop</p>
              <p className="text-xs font-bold text-brand-teal">AI Mastery 2.0</p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl premium-shadow animate-bounce-slow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-ink/50 uppercase tracking-wider">Course Completed</p>
              <p className="font-bold text-brand-teal">Scaling to 7 Figures</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const CourseCard = ({ course, onClick }: { course: Course, onClick?: () => void, key?: any }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    onClick={onClick}
    className="glass-card rounded-2xl overflow-hidden group cursor-pointer h-full flex flex-col"
  >
    <div className="aspect-video relative overflow-hidden">
      <img 
        src={course.thumbnail} 
        alt={course.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-brand-teal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <PlayCircle className="w-16 h-16 text-white" />
      </div>
      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-teal">
        {course.category}
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">{course.difficulty}</span>
        <div className="flex items-center gap-2">
          {course.is_paid ? (
            <span className="text-[10px] font-bold text-brand-teal bg-brand-teal/5 px-2 py-0.5 rounded-md">R{course.price}</span>
          ) : (
            <span className="text-[10px] font-bold text-brand-ink/30 uppercase tracking-widest">Free</span>
          )}
          {course.progress !== undefined && (
            <span className="text-[10px] font-bold text-brand-teal">{course.progress}% Complete</span>
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold text-brand-teal mb-2 group-hover:text-brand-orange transition-colors">{course.title}</h3>
      <p className="text-sm text-brand-ink/60 line-clamp-2 mb-6 flex-1">{course.description}</p>
      
      {course.progress !== undefined ? (
        <div className="w-full h-1.5 bg-brand-ink/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-orange transition-all duration-1000" 
            style={{ width: `${course.progress}%` }}
          />
        </div>
      ) : (
        <div className="flex items-center text-brand-teal font-bold text-sm group-hover:translate-x-2 transition-transform">
          View Course <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      )}
    </div>
  </motion.div>
);

const CourseForm = ({ 
  course, 
  setCourse, 
  onSubmit, 
  onCancel, 
  categories, 
  isEditing = false 
}: { 
  course: any, 
  setCourse: (c: any) => void, 
  onSubmit: (e: React.FormEvent) => void, 
  onCancel: () => void, 
  categories: any[],
  isEditing?: boolean
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleAddOutcome = () => {
    setCourse({ ...course, learning_outcomes: [...(course.learning_outcomes || []), ''] });
  };

  const handleOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...(course.learning_outcomes || [])];
    newOutcomes[index] = value;
    setCourse({ ...course, learning_outcomes: newOutcomes });
  };

  const handleRemoveOutcome = (index: number) => {
    const newOutcomes = course.learning_outcomes.filter((_: any, i: number) => i !== index);
    setCourse({ ...course, learning_outcomes: newOutcomes });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourse({ ...course, thumbnail_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Thumbnail Upload */}
      <div className="space-y-4">
        <label className="block text-xs font-bold text-brand-ink/40 uppercase tracking-widest">Course Thumbnail</label>
        <div 
          className={`relative h-64 rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 ${
            dragActive ? 'border-brand-orange bg-brand-orange/5' : 'border-brand-ink/10 bg-brand-ink/[0.02]'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setCourse({ ...course, thumbnail_url: reader.result as string });
              reader.readAsDataURL(file);
            }
          }}
        >
          {course.thumbnail_url || course.thumbnail ? (
            <>
              <img src={course.thumbnail_url || course.thumbnail} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button" 
                  onClick={() => setCourse({ ...course, thumbnail_url: '', thumbnail: '' })}
                  className="p-3 bg-red-500 text-white rounded-full shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-brand-ink/5">
                <Camera className="w-8 h-8 text-brand-orange" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-brand-teal">Drag and drop your image here</p>
                <p className="text-xs text-brand-ink/40">or click to browse files</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-3">Course Title</label>
            <input 
              type="text" 
              value={course.title}
              onChange={e => setCourse({...course, title: e.target.value})}
              className="w-full px-6 py-4 bg-white border border-brand-ink/5 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all"
              placeholder="e.g. AI-Driven Business Systems"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-3">Category</label>
            <select 
              value={course.category_id}
              onChange={e => setCourse({...course, category_id: parseInt(e.target.value)})}
              className="w-full px-6 py-4 bg-white border border-brand-ink/5 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all appearance-none"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-3">Difficulty</label>
            <select 
              value={course.difficulty}
              onChange={e => setCourse({...course, difficulty: e.target.value})}
              className="w-full px-6 py-4 bg-white border border-brand-ink/5 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all appearance-none"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-3">Status</label>
            <select 
              value={course.status}
              onChange={e => setCourse({...course, status: e.target.value})}
              className="w-full px-6 py-4 bg-white border border-brand-ink/5 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all appearance-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-brand-ink/40 uppercase tracking-widest">Pricing</label>
            <div className="flex items-center gap-4 p-2 bg-brand-ink/[0.02] rounded-2xl border border-brand-ink/5 w-fit">
              <button 
                type="button"
                onClick={() => setCourse({ ...course, is_paid: false })}
                className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${!course.is_paid ? 'bg-white text-brand-teal shadow-sm' : 'text-brand-ink/40'}`}
              >
                Free
              </button>
              <button 
                type="button"
                onClick={() => setCourse({ ...course, is_paid: true })}
                className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${course.is_paid ? 'bg-white text-brand-teal shadow-sm' : 'text-brand-ink/40'}`}
              >
                Paid
              </button>
            </div>
            
            <AnimatePresence>
              {course.is_paid && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-brand-ink/40">R</span>
                    <input 
                      type="number" 
                      value={course.price}
                      onChange={e => setCourse({...course, price: parseFloat(e.target.value)})}
                      className="w-full pl-10 pr-6 py-4 bg-white border border-brand-ink/5 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-6">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-3">Description</label>
            <textarea 
              value={course.description}
              onChange={e => setCourse({...course, description: e.target.value})}
              className="w-full px-6 py-4 bg-white border border-brand-ink/5 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all h-[140px] resize-none"
              placeholder="Describe what this course is about..."
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-brand-ink/40 uppercase tracking-widest">What Students Will Learn</label>
              <button 
                type="button" 
                onClick={handleAddOutcome}
                className="text-[10px] font-bold text-brand-orange uppercase tracking-widest hover:underline"
              >
                + Add Outcome
              </button>
            </div>
            <div className="space-y-3">
              {(course.learning_outcomes || []).map((outcome: string, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-orange" />
                    <input 
                      type="text" 
                      value={outcome}
                      onChange={e => handleOutcomeChange(index, e.target.value)}
                      className="w-full pl-10 pr-6 py-3 bg-white border border-brand-ink/5 rounded-xl text-sm focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all"
                      placeholder="e.g. Master AI automation tools"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveOutcome(index)}
                    className="p-3 text-brand-ink/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-brand-ink/5 flex gap-4">
        <button 
          type="submit" 
          className="px-10 py-4 bg-brand-teal text-white rounded-2xl font-bold shadow-xl shadow-brand-teal/20 hover:scale-105 transition-all"
        >
          {isEditing ? 'Update Course' : 'Create Course'}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-10 py-4 bg-brand-ink/5 text-brand-ink rounded-2xl font-bold hover:bg-brand-ink/10 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const AdminPanel = ({ currentUser }: { currentUser: any }) => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'courses' | 'users' | 'categories'>('overview');
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const initialCourseState: CourseFormData = { 
    title: '', 
    description: '', 
    category_id: 1, 
    difficulty: 'Beginner', 
    thumbnail_url: '', 
    status: 'draft',
    is_paid: false,
    price: 0,
    learning_outcomes: ['']
  };
  const [newCourse, setNewCourse] = useState<CourseFormData>(initialCourseState);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [newLesson, setNewLesson] = useState({ title: '', video_url: '', duration: 0 });
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<{
    type: 'role' | 'subscription';
    userId: number;
    previousValue: string;
    userName: string;
  } | null>(null);

  const authHeaders = { 'x-user-id': currentUser.id.toString() };

  useEffect(() => {
    if (editingCourseId) {
      fetch(`/api/admin/courses/${editingCourseId}/lessons`, { headers: authHeaders })
        .then(res => res.json())
        .then(data => setLessons(data))
        .catch(err => console.error(err));
    }
  }, [editingCourseId]);

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/courses/${editingCourseId}/lessons`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(newLesson)
      });
      if (res.ok) {
        const data = await res.json();
        setLessons([...lessons, { ...newLesson, id: data.id }]);
        setNewLesson({ title: '', video_url: '', duration: 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, coursesRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: authHeaders }),
          fetch('/api/admin/users', { headers: authHeaders }),
          fetch('/api/admin/courses', { headers: authHeaders }),
          fetch('/api/admin/categories', { headers: authHeaders })
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setCourses(data.map((c: any) => ({
            ...c,
            learning_outcomes: c.learning_outcomes ? JSON.parse(c.learning_outcomes) : [],
            thumbnail: c.thumbnail_url || c.thumbnail
          })));
        }
        if (categoriesRes.ok) setCategories(await categoriesRes.json());
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      }
    };
    fetchData();
  }, []);

  const handleUpdateUserRole = async (userId: number, role: string) => {
    const user = users.find(u => u.id === userId);
    const previousRole = user?.role;
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
        if (previousRole) {
          setLastAction({
            type: 'role',
            userId,
            previousValue: previousRole,
            userName: user.name
          });
          setTimeout(() => setLastAction(null), 5000);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUserSubscription = async (userId: number, status: string) => {
    const user = users.find(u => u.id === userId);
    const previousStatus = user?.subscription_status;
    try {
      const res = await fetch(`/api/admin/users/${userId}/subscription`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, subscription_status: status } : u));
        if (previousStatus) {
          setLastAction({
            type: 'subscription',
            userId,
            previousValue: previousStatus,
            userName: user.name
          });
          setTimeout(() => setLastAction(null), 5000);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = async () => {
    if (!lastAction) return;
    const { type, userId, previousValue } = lastAction;
    
    if (type === 'role') {
      await handleUpdateUserRole(userId, previousValue);
    } else {
      await handleUpdateUserSubscription(userId, previousValue);
    }
    setLastAction(null);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      console.log(`Attempting to delete user ${userId}`);
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (res.ok) {
        console.log(`User ${userId} deleted successfully`);
        setUsers(users.filter(u => u.id !== userId));
        setDeletingUserId(null);
      } else {
        const data = await res.json();
        console.error(`Failed to delete user ${userId}:`, data.error);
        alert(data.error || 'Failed to delete user');
        setDeletingUserId(null);
      }
    } catch (err) {
      console.error('Delete user error:', err);
      alert('A connection error occurred while trying to delete the user.');
      setDeletingUserId(null);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourse.status === 'published' && !newCourse.thumbnail_url) {
      alert('A thumbnail is required for published courses.');
      return;
    }
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        const data = await res.json();
        setCourses([...courses, { ...newCourse, id: data.id, thumbnail: newCourse.thumbnail_url, category: categories.find(c => c.id === newCourse.category_id)?.name || 'AI' }]);
        setIsAddingCourse(false);
        setNewCourse(initialCourseState);
      }
    } catch (err) {
      console.error('Failed to add course', err);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    if (editingCourse.status === 'published' && !editingCourse.thumbnail && !editingCourse.thumbnail_url) {
      alert('A thumbnail is required for published courses.');
      return;
    }
    try {
      const res = await fetch(`/api/admin/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCourse)
      });
      if (res.ok) {
        setCourses(courses.map(c => c.id === editingCourse.id ? { ...editingCourse, thumbnail: editingCourse.thumbnail_url || editingCourse.thumbnail } : c));
        setEditingCourse(null);
      }
    } catch (err) {
      console.error('Failed to update course', err);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE', headers: authHeaders });
      if (res.ok) {
        setCourses(courses.filter(c => c.id !== id));
        setDeletingCourseId(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete course');
        setDeletingCourseId(null);
      }
    } catch (err) {
      console.error('Failed to delete course', err);
      alert('A connection error occurred.');
      setDeletingCourseId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4 border-b border-brand-ink/5 pb-8">
        {['overview', 'courses', 'users', 'categories'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab as any)}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${
              activeSubTab === tab 
                ? 'bg-[#1A2E35] text-white shadow-lg' 
                : 'text-brand-ink/30 hover:text-brand-ink/50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeSubTab === 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-ink/40 uppercase tracking-wider">Total Users</p>
                <h4 className="text-3xl font-bold text-brand-teal">{stats.userCount}</h4>
              </div>
            </div>
          </div>
          <div className="glass-card p-8 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-ink/40 uppercase tracking-wider">Total Courses</p>
                <h4 className="text-3xl font-bold text-brand-teal">{stats.courseCount}</h4>
              </div>
            </div>
          </div>
          <div className="glass-card p-8 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-ink/40 uppercase tracking-wider">Completions</p>
                <h4 className="text-3xl font-bold text-brand-teal">{stats.completionCount}</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'courses' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-3xl font-bold text-brand-teal">Course Management</h3>
              <p className="text-brand-ink/40 text-sm">Create and manage your academy curriculum.</p>
            </div>
            {!isAddingCourse && !editingCourse && (
              <button 
                onClick={() => setIsAddingCourse(true)}
                className="flex items-center gap-2 px-8 py-4 bg-brand-orange text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-brand-orange/20"
              >
                <Plus className="w-5 h-5" /> Create New Course
              </button>
            )}
          </div>

          {isAddingCourse && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[2.5rem] border border-brand-ink/5 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-brand-orange" />
                </div>
                <h4 className="text-2xl font-bold text-brand-teal">New Course Details</h4>
              </div>
              <CourseForm 
                course={newCourse}
                setCourse={setNewCourse}
                onSubmit={handleAddCourse}
                onCancel={() => { setIsAddingCourse(false); setNewCourse(initialCourseState); }}
                categories={categories}
              />
            </motion.div>
          )}

          {editingCourse && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[2.5rem] border border-brand-teal/20 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-brand-teal/10 rounded-2xl flex items-center justify-center">
                  <Edit className="w-6 h-6 text-brand-teal" />
                </div>
                <h4 className="text-2xl font-bold text-brand-teal">Edit Course: {editingCourse.title}</h4>
              </div>
              <CourseForm 
                course={editingCourse}
                setCourse={setEditingCourse}
                onSubmit={handleUpdateCourse}
                onCancel={() => setEditingCourse(null)}
                categories={categories}
                isEditing={true}
              />
            </motion.div>
          )}

          {!isAddingCourse && !editingCourse && (
            <div className="bg-white rounded-[2rem] overflow-hidden border border-brand-ink/5 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-brand-ink/[0.02] text-brand-ink/30 text-[10px] font-bold uppercase tracking-[0.1em]">
                  <tr>
                    <th className="px-10 py-5">Course</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5">Category</th>
                    <th className="px-10 py-5">Pricing</th>
                    <th className="px-10 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-ink/5">
                  {courses.map(course => (
                    <tr key={course.id} className="hover:bg-brand-ink/[0.01] transition-colors">
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-10 rounded-lg overflow-hidden bg-brand-ink/5 border border-brand-ink/5 flex-shrink-0">
                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-brand-teal text-base">{course.title}</div>
                            <div className="text-xs text-brand-ink/30 font-medium">{course.difficulty}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          course.status === 'published' ? 'bg-green-50 text-green-600' : 
                          course.status === 'coming_soon' ? 'bg-blue-50 text-blue-600' :
                          course.status === 'archived' ? 'bg-red-50 text-red-600' :
                          'bg-brand-ink/[0.04] text-brand-ink/40'
                        }`}>
                          {course.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-10 py-7 text-sm text-brand-ink/40 font-medium">
                        {categories.find(c => c.id === course.category_id)?.name || course.category || 'N/A'}
                      </td>
                      <td className="px-10 py-7">
                        {course.is_paid ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-brand-teal">R{course.price}</span>
                            <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">Paid</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-brand-ink/30 uppercase tracking-widest">Free</span>
                        )}
                      </td>
                      <td className="px-10 py-7 text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => setEditingCourseId(course.id)}
                            className="flex items-center gap-2 px-4 py-2 text-brand-teal hover:bg-brand-teal/5 rounded-xl font-bold text-xs transition-all"
                          >
                            <PlayCircle className="w-4 h-4" /> Lessons
                          </button>
                          <button 
                            onClick={() => setEditingCourse(course)}
                            className="p-3 text-brand-teal hover:bg-brand-teal/5 rounded-xl transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          {deletingCourseId === course.id ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                              <button 
                                onClick={() => handleDeleteCourse(course.id)}
                                className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Confirm
                              </button>
                              <button 
                                onClick={() => setDeletingCourseId(null)}
                                className="px-3 py-1.5 bg-brand-ink/5 text-brand-ink/40 text-[10px] font-bold uppercase rounded-lg hover:bg-brand-ink/10 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setDeletingCourseId(course.id)} 
                              className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'users' && (
        <div className="bg-white rounded-[2rem] overflow-hidden border border-brand-ink/5 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-brand-ink/[0.02] text-brand-ink/30 text-[10px] font-bold uppercase tracking-[0.1em]">
              <tr>
                <th className="px-10 py-5">User</th>
                <th className="px-10 py-5">Role</th>
                <th className="px-10 py-5">Subscription</th>
                <th className="px-10 py-5">Joined</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ink/5">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-brand-ink/[0.01] transition-colors">
                  <td className="px-10 py-7">
                    <div className="font-bold text-brand-teal text-base">{user.name}</div>
                    <div className="text-xs text-brand-ink/30 font-medium">{user.email}</div>
                  </td>
                  <td className="px-10 py-7">
                    <select 
                      value={user.role}
                      onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                      className="bg-brand-ink/[0.04] border-none rounded-full text-[10px] font-bold uppercase px-4 py-1.5 cursor-pointer hover:bg-brand-ink/[0.08] transition-colors appearance-none text-center min-w-[80px]"
                    >
                      <option value="user">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-10 py-7">
                    <select 
                      value={user.subscription_status}
                      onChange={(e) => handleUpdateUserSubscription(user.id, e.target.value)}
                      className="bg-brand-ink/[0.04] border-none rounded-full text-[10px] font-bold uppercase px-4 py-1.5 cursor-pointer hover:bg-brand-ink/[0.08] transition-colors appearance-none text-center min-w-[80px]"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </td>
                  <td className="px-10 py-7 text-sm text-brand-ink/40 font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {deletingUserId === user.id ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => setDeletingUserId(null)}
                            className="px-3 py-1.5 bg-brand-ink/5 text-brand-ink/40 text-[10px] font-bold uppercase rounded-lg hover:bg-brand-ink/10 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeletingUserId(user.id)}
                          className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Remove User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Undo Notification */}
      <AnimatePresence>
        {lastAction && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-6 px-8 py-4 bg-brand-teal text-white rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium">
                Updated {lastAction.type} for <span className="font-bold">{lastAction.userName}</span>
              </p>
            </div>
            <button 
              onClick={handleUndo}
              className="px-4 py-1.5 bg-brand-orange text-white rounded-lg text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Zap className="w-3 h-3" /> Undo Change
            </button>
            <button 
              onClick={() => setLastAction(null)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {editingCourseId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-brand-teal/40 backdrop-blur-sm" onClick={() => setEditingCourseId(null)} />
          <div className="relative w-full max-w-4xl bg-brand-cream paper-texture rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-brand-ink/5 flex justify-between items-center bg-white/50">
              <h3 className="text-2xl font-bold text-brand-teal">Manage Lessons</h3>
              <button onClick={() => setEditingCourseId(null)} className="p-2 hover:bg-brand-ink/5 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <form onSubmit={handleAddLesson} className="glass-card p-6 rounded-2xl grid grid-cols-3 gap-4">
                <div className="col-span-3 font-bold text-brand-teal text-sm">Add New Lesson</div>
                <input 
                  placeholder="Lesson Title" 
                  value={newLesson.title}
                  onChange={e => setNewLesson({...newLesson, title: e.target.value})}
                  className="px-4 py-2 border border-brand-ink/5 rounded-xl bg-white"
                  required
                />
                <input 
                  placeholder="Video URL (YouTube/Vimeo)" 
                  value={newLesson.video_url}
                  onChange={e => setNewLesson({...newLesson, video_url: e.target.value})}
                  className="px-4 py-2 border border-brand-ink/5 rounded-xl bg-white"
                  required
                />
                <div className="flex gap-2">
                  <input 
                    type="number"
                    placeholder="Min" 
                    value={newLesson.duration || ''}
                    onChange={e => setNewLesson({...newLesson, duration: parseInt(e.target.value)})}
                    className="w-20 px-4 py-2 border border-brand-ink/5 rounded-xl bg-white"
                    required
                  />
                  <button type="submit" className="flex-1 bg-brand-teal text-white rounded-xl font-bold">Add</button>
                </div>
              </form>

              <div className="space-y-4">
                {lessons.length > 0 ? lessons.map((lesson, i) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-brand-ink/5">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-brand-ink/5 rounded-lg flex items-center justify-center font-bold text-brand-ink/40 text-xs">{i + 1}</div>
                      <div>
                        <div className="font-bold text-brand-teal">{lesson.title}</div>
                        <div className="text-[10px] text-brand-ink/40 font-mono">{lesson.video_url}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-brand-ink/40">{lesson.duration}m</span>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-brand-ink/40 py-8">No lessons added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileSettings = ({ user, onUpdate }: { user: any, onUpdate: (user: any) => void }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    bio: user.bio || '',
    profile_image: user.profile_image || '',
    business_info: user.business_info || '',
    learning_interests: user.learning_interests || '',
    experience_level: user.experience_level || 'Beginner',
    business_stage: user.business_stage || 'Idea'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const authHeaders = { 'x-user-id': user.id.toString() };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        onUpdate(data.user);
        setMessage({ 
          type: 'success', 
          text: data.emailChanged 
            ? 'Profile updated! Please check your new email for verification.' 
            : 'Profile updated successfully!' 
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while saving.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-teal">Account Settings</h2>
        {message.text && (
          <div className={`px-4 py-2 rounded-xl text-sm font-bold animate-fade-in ${
            message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Header */}
        <div className="glass-card p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-brand-teal/10 overflow-hidden border-4 border-white shadow-2xl relative">
              {formData.profile_image ? (
                <img src={formData.profile_image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-teal/20">
                  <UserIcon className="w-12 h-12" />
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-orange text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-brand-teal mb-1">{formData.name || 'Your Name'}</h3>
            <p className="text-brand-ink/40 font-medium mb-4">{formData.email}</p>
            {!user.email_verified && (
              <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-[10px] font-bold uppercase tracking-wider">
                Pending Verification
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="glass-card p-8 rounded-[2rem] space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <UserIcon className="w-5 h-5 text-brand-orange" />
              <h4 className="font-bold text-brand-teal uppercase tracking-widest text-xs">Basic Information</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-ink/5 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-ink/5 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Short Bio</label>
                <textarea 
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-ink/5 rounded-xl text-sm h-24 focus:ring-2 focus:ring-brand-orange/20 outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="glass-card p-8 rounded-[2rem] space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-5 h-5 text-brand-orange" />
              <h4 className="font-bold text-brand-teal uppercase tracking-widest text-xs">Business Context</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Business Name / Info</label>
                <input 
                  type="text" 
                  value={formData.business_info}
                  onChange={e => setFormData({...formData, business_info: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-ink/5 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 outline-none"
                  placeholder="Company name or industry"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Business Stage</label>
                <select 
                  value={formData.business_stage}
                  onChange={e => setFormData({...formData, business_stage: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-ink/5 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 outline-none"
                >
                  <option>Idea</option>
                  <option>Early Stage</option>
                  <option>Growth</option>
                  <option>Scale</option>
                  <option>Established</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Experience Level</label>
                <select 
                  value={formData.experience_level}
                  onChange={e => setFormData({...formData, experience_level: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-ink/5 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 outline-none"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="glass-card p-8 rounded-[2rem] md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-brand-orange" />
              <h4 className="font-bold text-brand-teal uppercase tracking-widest text-xs">Learning Interests</h4>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest mb-2">What are you looking to master?</label>
              <input 
                type="text" 
                value={formData.learning_interests}
                onChange={e => setFormData({...formData, learning_interests: e.target.value})}
                className="w-full px-4 py-3 bg-brand-cream border border-brand-ink/5 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 outline-none"
                placeholder="e.g. AI Automation, Brand Strategy, Scaling Teams"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-12 py-4 bg-brand-teal text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-brand-teal/20 disabled:opacity-50 flex items-center gap-3"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const CourseViewer = ({ course, currentUser, onBack }: { course: any, currentUser: any, onBack: () => void }) => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const authHeaders = { 'x-user-id': currentUser.id.toString() };

  useEffect(() => {
    fetch(`/api/admin/courses/${course.id}/lessons`, { headers: authHeaders })
      .then(res => res.json())
      .then(data => {
        setLessons(data);
        if (data.length > 0) setActiveLesson(data[0]);
      });
  }, [course.id]);

  useEffect(() => {
    if (activeLesson) {
      fetch(`/api/notes/${activeLesson.id}`, { headers: authHeaders })
        .then(res => res.json())
        .then(data => setNotes(data));
    }
  }, [activeLesson]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: activeLesson.id, content: newNote })
    });
    if (res.ok) {
      setNotes([...notes, { content: newNote, created_at: new Date().toISOString() }]);
      setNewNote('');
    }
  };

  const handleToggleProgress = async () => {
    const res = await fetch(`/api/lessons/${activeLesson.id}/progress`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true, progress_percentage: 100 })
    });
    if (res.ok) {
      // Update local state or notify parent
    }
  };

  return (
    <div className="space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-brand-teal font-bold hover:text-brand-orange transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
            {activeLesson ? (
              <div className="w-full h-full flex items-center justify-center text-white">
                <Play className="w-20 h-20 opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <h4 className="text-xl font-bold">{activeLesson.title}</h4>
                    <p className="text-sm opacity-60">Lesson {lessons.indexOf(activeLesson) + 1} of {lessons.length}</p>
                  </div>
                  <button onClick={handleToggleProgress} className="px-6 py-2 bg-brand-teal text-white rounded-xl font-bold text-sm">Mark Complete</button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">Select a lesson to start</div>
            )}
          </div>

          <div className="glass-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-brand-teal">My Notes</h3>
              <FileText className="w-5 h-5 text-brand-ink/20" />
            </div>
            <form onSubmit={handleAddNote} className="mb-6">
              <textarea 
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Write a note for this lesson..."
                className="w-full px-4 py-3 bg-brand-cream border border-brand-ink/5 rounded-xl text-sm h-24 mb-3"
              />
              <button type="submit" className="px-6 py-2 bg-brand-teal text-white rounded-xl font-bold text-sm">Save Note</button>
            </form>
            <div className="space-y-4">
              {notes.map((note, i) => (
                <div key={i} className="p-4 bg-brand-cream rounded-xl border border-brand-ink/5">
                  <p className="text-sm text-brand-ink/70 mb-2">{note.content}</p>
                  <p className="text-[10px] text-brand-ink/30 font-bold uppercase">{new Date(note.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-brand-teal mb-6">Course Content</h3>
            <div className="space-y-3">
              {lessons.map((lesson, i) => (
                <button 
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                    activeLesson?.id === lesson.id ? 'bg-brand-teal text-white shadow-lg' : 'hover:bg-brand-ink/5 text-brand-ink/60'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    activeLesson?.id === lesson.id ? 'bg-white/20' : 'bg-brand-ink/5'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm leading-tight">{lesson.title}</div>
                    <div className="text-[10px] opacity-60">{lesson.duration}m</div>
                  </div>
                  {activeLesson?.id === lesson.id && <PlayCircle className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LearningDashboard = ({ 
  currentUser, 
  courses, 
  myCourses, 
  onViewCourse, 
  onEnroll,
  stats 
}: { 
  currentUser: any, 
  courses: Course[], 
  myCourses: number[], 
  onViewCourse: (course: Course) => void,
  onEnroll: (courseId: number) => void,
  stats: any
}) => {
  const enrolledCourses = courses.filter(c => myCourses.includes(c.id));
  const recentCourse = stats.recentCourse ? courses.find(c => c.id === stats.recentCourse.id) : enrolledCourses[0];
  const recommendedCourses = courses.filter(c => !myCourses.includes(c.id)).slice(0, 3);

  const roadmapStages = ['Foundation', 'Strategy', 'Execution', 'Mastery'];
  const currentStageIndex = roadmapStages.indexOf(stats.roadmapStage || 'Foundation');

  const badges = [
    { id: 1, label: "First Course Started", icon: PlayCircle, earned: myCourses.length > 0 },
    { id: 2, label: "5 Hours Completed", icon: Clock, earned: stats.hoursCompleted >= 5 },
    { id: 3, label: "7 Day Learning Streak", icon: Flame, earned: stats.streak >= 7 },
    { id: 4, label: "Course Completed", icon: Award, earned: stats.certificates > 0 }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Personal Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Courses Enrolled', value: stats.enrolledCount || 0, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Hours Completed', value: stats.hoursCompleted || 0, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Learning Streak', value: `${stats.streak || 0} Days`, icon: Flame, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Certificates', value: stats.certificates || 0, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-bold text-brand-teal">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Continue Learning */}
      <section>
        <h2 className="text-2xl font-bold text-brand-teal mb-6">Continue Learning</h2>
        {recentCourse ? (
          <div className="glass-card p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-72 aspect-video rounded-2xl overflow-hidden shadow-lg">
              <img src={recentCourse.thumbnail} alt={recentCourse.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">{recentCourse.category}</span>
                <h3 className="text-2xl font-bold text-brand-teal">{recentCourse.title}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-brand-ink/40">Progress</span>
                  <span className="text-brand-teal">{recentCourse.progress || 0}%</span>
                </div>
                <div className="w-full h-2 bg-brand-ink/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-teal transition-all duration-1000" style={{ width: `${recentCourse.progress || 0}%` }} />
                </div>
              </div>
              <button 
                onClick={() => onViewCourse(recentCourse)}
                className="px-8 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2 mx-auto md:mx-0"
              >
                <PlayCircle className="w-5 h-5" /> Resume Course
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 rounded-[2.5rem] text-center space-y-6 border-2 border-dashed border-brand-ink/10">
            <div className="w-20 h-20 bg-brand-orange/10 text-brand-orange rounded-3xl flex items-center justify-center mx-auto">
              <Rocket className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-teal">Start Your Leadership Journey</h3>
              <p className="text-brand-ink/50 max-w-md mx-auto">Explore curated programs designed to help you grow and lead with confidence.</p>
            </div>
            <button className="px-10 py-4 bg-brand-orange text-white rounded-2xl font-bold shadow-xl shadow-brand-orange/20 hover:scale-105 transition-all">
              Browse Courses
            </button>
          </div>
        )}
      </section>

      {/* 3. Recommended For You */}
      <section>
        <h2 className="text-2xl font-bold text-brand-teal mb-6">Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendedCourses.map(course => (
            <div key={course.id} className="relative group">
              <CourseCard course={course} />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <button 
                  onClick={() => onEnroll(course.id)}
                  className="pointer-events-auto px-6 py-2 bg-brand-orange text-white rounded-xl font-bold shadow-xl flex items-center gap-2"
                >
                  <Unlock className="w-5 h-5" /> Start Course
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Learning Roadmap Section */}
      <section>
        <h2 className="text-2xl font-bold text-brand-teal mb-6">Learning Roadmap</h2>
        <div className="glass-card p-10 rounded-[2.5rem]">
          <div className="relative flex justify-between items-center">
            {/* Line */}
            <div className="absolute left-0 right-0 h-1 bg-brand-ink/5 top-1/2 -translate-y-1/2 z-0" />
            <div 
              className="absolute left-0 h-1 bg-brand-orange top-1/2 -translate-y-1/2 z-0 transition-all duration-1000" 
              style={{ width: `${(currentStageIndex / (roadmapStages.length - 1)) * 100}%` }} 
            />
            
            {roadmapStages.map((stage, i) => (
              <div key={stage} className="relative z-10 flex flex-col items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all ${
                  i <= currentStageIndex ? 'bg-brand-orange text-white' : 'bg-brand-ink/10 text-brand-ink/30'
                }`}>
                  {i < currentStageIndex ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${
                  i === currentStageIndex ? 'text-brand-orange' : 'text-brand-ink/30'
                }`}>
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Achievements & Badges */}
      <section>
        <h2 className="text-2xl font-bold text-brand-teal mb-6">Achievements & Badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.some(b => b.earned) ? badges.map(badge => (
            <div key={badge.id} className={`glass-card p-6 rounded-3xl flex flex-col items-center text-center gap-4 transition-all ${
              badge.earned ? 'opacity-100' : 'opacity-30 grayscale'
            }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner ${
                badge.earned ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-ink/5 text-brand-ink/20'
              }`}>
                <badge.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-brand-teal text-sm">{badge.label}</p>
                <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest">
                  {badge.earned ? 'Unlocked' : 'Locked'}
                </p>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center bg-brand-ink/[0.02] rounded-3xl border border-dashed border-brand-ink/10">
              <p className="text-brand-ink/40 font-medium">You have not earned any badges yet. Start learning to unlock achievements.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const Dashboard = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('command-center');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [isSearching, setIsSearching] = useState(false);
  const [viewingCourse, setViewingCourse] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [myCourses, setMyCourses] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState(user);
  const [dashboardStats, setDashboardStats] = useState<any>({});

  const authHeaders = { 'x-user-id': currentUser.id.toString() };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [coursesRes, bookmarksRes, myCoursesRes, profileRes, dashboardStatsRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/bookmarks', { headers: authHeaders }),
          fetch('/api/my-courses', { headers: authHeaders }),
          fetch('/api/profile', { headers: authHeaders }),
          fetch('/api/user/dashboard-stats', { headers: authHeaders })
        ]);
        
        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setCourses(data.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            category: c.category_id === 1 ? 'AI' : c.category_id === 2 ? 'Scaling' : c.category_id === 3 ? 'Branding' : 'Leadership',
            difficulty: c.difficulty,
            thumbnail: c.thumbnail_url || `https://picsum.photos/seed/${c.id}/800/450`,
            status: c.status,
            is_paid: c.is_paid === 1,
            price: c.price,
            learning_outcomes: c.learning_outcomes ? JSON.parse(c.learning_outcomes) : [],
            progress: 0
          })));
        }

        if (bookmarksRes.ok) {
          const data = await bookmarksRes.json();
          setBookmarks(data.map((b: any) => b.course_id));
        }

        if (myCoursesRes.ok) {
          const data = await myCoursesRes.json();
          setMyCourses(data.map((c: any) => c.id));
        }

        if (profileRes.ok) {
          const data = await profileRes.json();
          setCurrentUser(data);
        }

        if (dashboardStatsRes.ok) {
          setDashboardStats(await dashboardStatsRes.json());
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const handleEnroll = async (courseId: number) => {
    const res = await fetch(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: authHeaders
    });
    if (res.ok) {
      setMyCourses([...myCourses, courseId]);
    }
  };

  const handleToggleBookmark = async (courseId: number) => {
    const isBookmarked = bookmarks.includes(courseId);
    const method = isBookmarked ? 'DELETE' : 'POST';
    const url = isBookmarked ? `/api/bookmarks/${courseId}` : '/api/bookmarks';
    const body = isBookmarked ? undefined : JSON.stringify({ courseId });

    const res = await fetch(url, {
      method,
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body
    });

    if (res.ok) {
      setBookmarks(isBookmarked ? bookmarks.filter(id => id !== courseId) : [...bookmarks, courseId]);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'my-courses', label: 'My Courses', icon: BookOpen },
    { id: 'analytics', label: 'Growth Analytics', icon: TrendingUp },
    { id: 'community', label: 'Community', icon: Users },
  ];

  if (user.role === 'admin') {
    navItems.push({ id: 'admin-panel', label: 'Admin Panel', icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen flex bg-brand-cream paper-texture">
      {/* Sidebar */}
      <aside className="w-72 border-r border-brand-ink/5 bg-white/50 backdrop-blur-xl hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-xl">G</div>
          <span className="text-lg font-bold tracking-tight text-brand-teal">GovLead</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === item.id 
                  ? 'bg-brand-orange/[0.08] text-brand-orange border border-brand-orange/20 shadow-sm' 
                  : 'text-brand-ink/60 hover:bg-brand-ink/5 border border-transparent'
              }`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-brand-ink/5 space-y-2 mt-auto">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'settings' ? 'bg-brand-ink/5 text-brand-teal' : 'text-brand-ink/60 hover:bg-brand-ink/5'
            }`}
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors group relative"
          >
            <LogOut className="w-5 h-5" /> Sign Out
            
            {/* Hover Tooltip - Shows detailed user info only on hover */}
            <div className="absolute bottom-full left-0 mb-4 w-full px-4 py-3 bg-brand-teal text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl z-50 translate-y-2 group-hover:translate-y-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] uppercase tracking-widest opacity-60 leading-none mb-1">Signed in as</div>
                  <div className="font-bold text-sm leading-none truncate">{currentUser.name}</div>
                </div>
              </div>
              {/* Tooltip Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-teal rotate-45" />
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-brand-teal mb-2">
              {activeTab === 'command-center' ? `Welcome back, ${currentUser.name}` : 
               activeTab === 'my-courses' ? 'My Learning Path' :
               activeTab === 'analytics' ? 'Growth Analytics' :
               activeTab === 'community' ? 'Community Hub' : 
               activeTab === 'admin-panel' ? 'Admin Control Center' : 'Settings'}
            </h1>
            <p className="text-brand-ink/50">
              {activeTab === 'command-center' ? "You've completed 2 lessons this week. Keep it up!" : 
               activeTab === 'admin-panel' ? "Manage your academy infrastructure and users." :
               "Manage your journey and connect with other leaders."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isSearching ? 'text-brand-orange' : 'text-brand-ink/30'}`} />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearching(true)}
                onBlur={() => setIsSearching(false)}
                className="pl-12 pr-6 py-3 bg-white border border-brand-ink/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 w-64 transition-all"
              />
            </div>
            <div className="relative group">
              <div className="w-12 h-12 bg-brand-teal rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                {currentUser.profile_image ? (
                  <img src={currentUser.profile_image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} alt="Avatar" />
                )}
              </div>
              
              {/* User Info Tooltip */}
              <div className="absolute top-full right-0 mt-4 px-4 py-3 bg-brand-teal text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl z-50 translate-y-2 group-hover:translate-y-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-none mb-1">{currentUser.name}</div>
                    <div className="text-[10px] opacity-60 leading-none">{currentUser.email}</div>
                  </div>
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute -top-1 right-5 w-2 h-2 bg-brand-teal rotate-45" />
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'command-center' && viewingCourse && (
              <CourseViewer 
                course={viewingCourse} 
                currentUser={currentUser} 
                onBack={() => setViewingCourse(null)} 
              />
            )}

            {activeTab === 'command-center' && !viewingCourse && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-brand-teal">
                        {searchQuery ? `Search Results (${filteredCourses.length})` : 'Continue Watching'}
                      </h2>
                      {!searchQuery && <a href="#" className="text-sm font-bold text-brand-orange hover:underline">View All</a>}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {filteredCourses.length > 0 ? (
                        filteredCourses.slice(0, searchQuery ? undefined : 2).map(course => (
                          <div key={course.id} className="relative group">
                            <CourseCard course={course} />
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleToggleBookmark(course.id)}
                                className={`p-2 rounded-lg shadow-lg transition-colors ${bookmarks.includes(course.id) ? 'bg-brand-orange text-white' : 'bg-white text-brand-ink/40 hover:text-brand-orange'}`}
                              >
                                <Bookmark className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              {myCourses.includes(course.id) ? (
                                <button 
                                  onClick={() => setViewingCourse(course)}
                                  className="pointer-events-auto px-6 py-2 bg-brand-teal text-white rounded-xl font-bold shadow-xl flex items-center gap-2"
                                >
                                  <PlayCircle className="w-5 h-5" /> Resume
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleEnroll(course.id)}
                                  className="pointer-events-auto px-6 py-2 bg-brand-orange text-white rounded-xl font-bold shadow-xl flex items-center gap-2"
                                >
                                  <Unlock className="w-5 h-5" /> Enroll Now
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 py-12 text-center bg-white/50 rounded-3xl border border-dashed border-brand-ink/10">
                          <p className="text-brand-ink/40 font-medium">No courses found matching "{searchQuery}"</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {!searchQuery && (
                    <section>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-brand-teal">Recommended For You</h2>
                        <div className="flex gap-2">
                          <button className="p-2 bg-white border border-brand-ink/5 rounded-lg hover:bg-brand-cream"><Filter className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {courses.slice(2, 4).map(course => (
                          <div key={course.id} className="relative group">
                            <CourseCard course={course} />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              {myCourses.includes(course.id) ? (
                                <button 
                                  onClick={() => setViewingCourse(course)}
                                  className="pointer-events-auto px-6 py-2 bg-brand-teal text-white rounded-xl font-bold shadow-xl flex items-center gap-2"
                                >
                                  <PlayCircle className="w-5 h-5" /> Resume
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleEnroll(course.id)}
                                  className="pointer-events-auto px-6 py-2 bg-brand-orange text-white rounded-xl font-bold shadow-xl flex items-center gap-2"
                                >
                                  <Unlock className="w-5 h-5" /> Enroll Now
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <div className="space-y-8">
                  <div className="glass-card p-8 rounded-3xl premium-shadow">
                    <h3 className="text-xl font-bold text-brand-teal mb-6">Your Progress</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-2">
                          <span className="text-brand-ink/60">Overall Completion</span>
                          <span className="text-brand-orange">32%</span>
                        </div>
                        <div className="w-full h-2 bg-brand-ink/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-orange w-[32%]" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-brand-cream p-4 rounded-2xl">
                          <p className="text-2xl font-bold text-brand-teal">12</p>
                          <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-wider">Lessons Done</p>
                        </div>
                        <div className="bg-brand-cream p-4 rounded-2xl">
                          <p className="text-2xl font-bold text-brand-teal">4</p>
                          <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-wider">Certificates</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-8 rounded-3xl premium-shadow">
                    <h3 className="text-xl font-bold text-brand-teal mb-6">Achievements</h3>
                    <div className="space-y-4">
                      {[
                        { icon: Award, label: "Early Adopter", color: "text-blue-500" },
                        { icon: TrendingUp, label: "Fast Learner", color: "text-orange-500" },
                        { icon: Users, label: "Networker", color: "text-green-500" }
                      ].map((badge, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-brand-ink/5 rounded-xl transition-colors cursor-pointer group">
                          <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${badge.color}`}>
                            <badge.icon className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-brand-teal text-sm">{badge.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'my-courses' && (
              <LearningDashboard 
                currentUser={currentUser}
                courses={courses}
                myCourses={myCourses}
                onViewCourse={setViewingCourse}
                onEnroll={handleEnroll}
                stats={dashboardStats}
              />
            )}

            {activeTab === 'admin-panel' && <AdminPanel currentUser={currentUser} />}

            {activeTab === 'settings' && <ProfileSettings user={currentUser} onUpdate={setCurrentUser} />}

            {activeTab !== 'command-center' && activeTab !== 'my-courses' && activeTab !== 'admin-panel' && activeTab !== 'settings' && (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-brand-orange/10 text-brand-orange rounded-3xl flex items-center justify-center mx-auto mb-6">
                  {activeTab === 'my-courses' ? <BookOpen className="w-10 h-10" /> :
                   activeTab === 'analytics' ? <TrendingUp className="w-10 h-10" /> :
                   activeTab === 'community' ? <Users className="w-10 h-10" /> : <Settings className="w-10 h-10" />}
                </div>
                <h2 className="text-2xl font-bold text-brand-teal mb-2">
                  {activeTab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} is coming soon
                </h2>
                <p className="text-brand-ink/50 max-w-md mx-auto">
                  We're building a world-class experience for this section. Stay tuned for the next update of the GovLead OS.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, onLogin, message }: { isOpen: boolean, onClose: () => void, onLogin: (user: any) => void, message?: string }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const payload = mode === 'login' ? { email, password } : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.user);
      } else {
        const data = await response.json();
        setError(data.error || 'Action failed. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-teal/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-brand-cream paper-texture rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-12">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-lg shadow-brand-orange/20">G</div>
                <h2 className="text-3xl font-bold text-brand-teal mb-2">
                  {mode === 'login' ? 'Welcome Back' : 'Join the Academy'}
                </h2>
                <p className="text-brand-ink/50">
                  {message ? message : (mode === 'login' ? 'Enter your credentials to access your OS.' : 'Start your journey to business mastery today.')}
                </p>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-4 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100 mb-4">
                    {error}
                  </div>
                )}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-6 py-4 bg-white border border-brand-ink/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-6 py-4 bg-white border border-brand-ink/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-2 ml-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-6 py-4 bg-white border border-brand-ink/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-teal text-white rounded-2xl font-bold hover:bg-brand-teal/90 transition-all shadow-xl shadow-brand-teal/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-brand-ink/5 text-center">
                <p className="text-sm text-brand-ink/50">
                  {mode === 'login' ? (
                    <>Don't have an account? <button onClick={() => setMode('signup')} className="text-brand-orange font-bold hover:underline">Create one for free</button></>
                  ) : (
                    <>Already have an account? <button onClick={() => setMode('login')} className="text-brand-orange font-bold hover:underline">Sign in instead</button></>
                  )}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-brand-ink/30 hover:text-brand-ink transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);

  // Simulate loading and check for persisted session
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const savedUser = localStorage.getItem('govlead_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Fetch public courses
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          category: c.category_id === 1 ? 'AI' : c.category_id === 2 ? 'Scaling' : 'Business',
          difficulty: c.difficulty,
          thumbnail: c.thumbnail_url || `https://picsum.photos/seed/${c.id}/800/450`
        })));
      })
      .catch(err => console.error('Failed to fetch public courses', err));

    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('govlead_user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    setAuthModalMessage('');
  };

  const handleCourseClick = () => {
    setAuthModalMessage('Please sign in or create an account to access this course.');
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('govlead_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center paper-texture">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-20 h-20 bg-brand-orange rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-2xl shadow-brand-orange/20"
        >
          G
        </motion.div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-brand-cream paper-texture selection:bg-brand-orange/30">
      <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />
      
      <main>
        <Hero />
        
        {/* Trending Section */}
        <section id="courses" className="py-24 px-6 bg-white/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-brand-teal mb-2">Trending Courses</h2>
                <p className="text-brand-ink/50">The most impactful systems being built right now.</p>
              </div>
              <button className="hidden md:flex items-center gap-2 text-brand-orange font-bold hover:translate-x-1 transition-transform">
                View All Catalog <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(courses.length > 0 ? courses : MOCK_COURSES).slice(0, 4).map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onClick={handleCourseClick}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="vision" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-brand-teal text-center mb-16">Master Every Dimension</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { name: "AI Systems", icon: "🤖" },
                { name: "Branding", icon: "🎨" },
                { name: "Scaling", icon: "🚀" },
                { name: "Leadership", icon: "👑" },
                { name: "Operations", icon: "⚙️" }
              ].map((cat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-8 rounded-3xl text-center hover:bg-brand-orange hover:text-white transition-all group cursor-pointer"
                >
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">{cat.icon}</div>
                  <span className="font-bold tracking-tight">{cat.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-brand-teal rounded-[3rem] p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none paper-texture" />
            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-white mb-8">Ready to build your <br /> Business Operating System?</h2>
              <p className="text-white/70 text-xl mb-12 max-w-2xl mx-auto">Join 5,000+ entrepreneurs scaling their businesses with GovLead Academy.</p>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-12 py-5 bg-brand-orange text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-brand-orange/30"
              >
                Get Started for Free
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-brand-ink/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-lg">G</div>
            <span className="font-bold text-brand-teal">GovLead Academy</span>
          </div>
          <p className="text-sm text-brand-ink/40">© 2026 GovLead Academy. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-brand-ink/40 hover:text-brand-orange transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-brand-ink/40 hover:text-brand-orange transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthModalMessage('');
        }} 
        onLogin={handleLogin}
        message={authModalMessage}
      />
    </div>
  );
}

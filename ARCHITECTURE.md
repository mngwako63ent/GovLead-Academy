# GovLead Academy - Technical Documentation

## System Architecture Overview
GovLead Academy is built as a full-stack SaaS application using React (Vite) with an Express backend. The architecture follows a layered approach:
1. **Discovery Layer**: Public-facing landing pages and catalog.
2. **Operating Layer**: Authenticated learner dashboard and course player.
3. **Management Layer**: Admin-only tools for content and user management.

## Folder Structure
```text
/src
  /components
    /ui          # Reusable atomic components (Button, Input, Card)
    /layout      # Layout wrappers (Navbar, Sidebar, Footer)
    /discovery   # Discovery layer specific components
    /learner     # Learner ecosystem components
    /admin       # Admin management components
  /pages         # Page components
  /services      # API client and logic
  /store         # State management (Zustand or Context)
  /types         # TypeScript definitions
  /utils         # Helper functions
/server
  /routes        # Express API routes
  /db            # Database configuration and migrations
  /middleware    # Auth and validation middleware
```

## Database Schema (Stripe-Ready)
- **Users**: `id, name, email, password_hash, role (user/admin), subscription_status, onboarding_data, created_at`
- **Courses**: `id, title, description, category_id, difficulty, thumbnail_url, status, created_at`
- **Modules**: `id, course_id, title, order_index`
- **Lessons**: `id, module_id, title, video_url, duration, order_index, content_markdown`
- **UserProgress**: `user_id, lesson_id, completed, last_watched, progress_percent`
- **Categories**: `id, name, slug`
- **Certificates**: `id, user_id, course_id, issue_date`

## Page Hierarchy
- `/` - Homepage
- `/catalog` - Course Catalog
- `/course/:id` - Course Detail (Public)
- `/auth/login` & `/auth/signup`
- `/onboarding` - Multi-step wizard
- `/dashboard` - Learner Command Center
- `/learn/:courseId/:lessonId` - Course Player
- `/settings` - User Profile
- `/admin` - Admin Dashboard
- `/admin/courses` - Course Management
- `/admin/users` - User Management

## Development Roadmap
- **Phase 1**: Core Infrastructure (DB, Auth, Basic Layouts)
- **Phase 2**: Learner Experience (Dashboard, Course Player, Progress Tracking)
- **Phase 3**: Admin Suite & Content Analytics
- **Phase 4**: Polish & Premium Interactions (Transitions, Texture, Dark Mode)

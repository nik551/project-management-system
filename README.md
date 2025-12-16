# Project Management System

A modern, full-stack project management application with multi-tenant support, built with Django, GraphQL, React, and TypeScript.

![Project Management Dashboard](screenshots/dashboard.png)
![Project Management TaskBoard](screenshots/task.png)

## Overview

This application demonstrates a complete project management system with organization-based multi-tenancy, allowing teams to manage projects, tasks, and collaborate through comments. Built with modern technologies and best practices for scalability and maintainability.

##  Features

### Core Functionality
- **Multi-Tenant Architecture**: Complete data isolation per organization
- **Project Management**: Create, view, and track project progress with status indicators
- **Kanban Task Board**: Visual task management with three-column layout (To Do, In Progress, Done)
- **Task Collaboration**: Add comments and discussions on individual tasks
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Technical Features
- **GraphQL API**: Flexible, efficient data fetching with strongly-typed schema
- **Type Safety**: Full TypeScript implementation across frontend
- **Modern UI**: Clean, professional interface with Tailwind CSS v4
- **Data Validation**: Client-side and server-side form validation
- **Error Handling**: Graceful error states and user feedback

## Architecture

### Database Schema
```
Organization (Multi-tenant root)
    ├── name, slug, contact_email
    └── Projects (1-to-many)
            ├── name, description, status, due_date
            └── Tasks (1-to-many)
                    ├── title, description, status, assignee_email, due_date
                    └── TaskComments (1-to-many)
                            └── content, author_email, timestamp
```

### Multi-Tenant Implementation

The application uses **organization-based multi-tenancy**:
- All data is scoped to an organization
- GraphQL queries filter by organization slug
- Complete data isolation between organizations
- Scalable architecture for future user authentication

##  Getting Started

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- PostgreSQL (or Neon account for cloud database)
- Git


### Installation
#### 1. Clone the Repository
```bash
git clone https://github.com/nik551/project-management-system.git
cd project-management-system
```
#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your database credentials

# Run migrations
python manage.py migrate

# Create sample data (optional)
python create_sample_data.py

# Create superuser for admin access
python manage.py createsuperuser

# Start development server
python manage.py runserver
```
Backend will be available at: **http://localhost:8000**

GraphQL Playground: **http://localhost:8000/graphql/**

Django Admin: **http://localhost:8000/admin/**

#### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Default values should work for local development

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key-here
DEBUG=True
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/graphql/
```

### Sample Data

The `create_sample_data.py` script creates:
- 2 organizations (Tech Startup Inc, Design Agency)
- 3 projects with various statuses
- 5 tasks distributed across projects
- 2 comments on tasks

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```
**Test Coverage (13 tests):**
- Model creation and validation
- Multi-tenant data isolation
- GraphQL queries (list, filter, single item)
- GraphQL mutations (create, update)
- Data integrity and relationships

### Frontend Tests
```bash
cd frontend
npm test
```
**Test Coverage (11 tests):**
- Component rendering
- TypeScript type definitions
- Props handling and data display
- Empty states
- Progress calculation logic

### Run All Tests
```bash
# Backend
cd backend && python manage.py test

# Frontend
cd frontend && npm test
```
##  API Documentation

See [API_DOCS.md](API_DOCS.md) for:
- Complete GraphQL schema
- Example queries and mutations
- Request/response formats
- Error handling

## Admin Panel

Access Django admin at http://localhost:8000/admin/

**Creating Organizations:**
1. Login with superuser credentials
2. Navigate to "Organizations"
3. Click "Add Organization"
4. Fill in name, slug, and contact email
5. Save

Organizations created through admin will appear in the frontend dropdown.

## Future Enhancements

- [ ] User authentication (JWT tokens)
- [ ] Role-based permissions (admin, member, viewer)
- [ ] Drag-and-drop task reordering
- [ ] Real-time updates with GraphQL subscriptions
- [ ] Email notifications for task assignments
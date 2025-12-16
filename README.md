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

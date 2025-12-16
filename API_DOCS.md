# API Documentation

GraphQL API documentation for the Project Management System.

## Base URL

**Local Development:** `http://localhost:8000/graphql/`

**Production:** 




---

## Schema Overview

### Types
```graphql
type Organization {
  id: ID!
  name: String!
  slug: String!
  contactEmail: String!
  createdAt: DateTime!
  updatedAt: DateTime
}

type Project {
  id: ID!
  name: String!
  description: String
  status: String!
  dueDate: Date
  taskCount: Int!
  completedTasks: Int!
  createdAt: DateTime!
  updatedAt: DateTime
  organization: Organization!
}

type Task {
  id: ID!
  title: String!
  description: String
  status: String!
  assigneeEmail: String
  dueDate: DateTime
  createdAt: DateTime!
  updatedAt: DateTime
  project: Project!
}

type TaskComment {
  id: ID!
  content: String!
  authorEmail: String!
  createdAt: DateTime!
  updatedAt: DateTime
  task: Task!
}
```

### Enums
```graphql
enum ProjectStatus {
  ACTIVE
  COMPLETED
  ON_HOLD
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}
```

---

## Queries

### 1. List All Organizations
```graphql
query GetAllOrganizations {
  allOrganizations {
    id
    name
    slug
    contactEmail
    createdAt
  }
}
```

**Response:**
```json
{
  "data": {
    "allOrganizations": [
      {
        "id": "1",
        "name": "Tech Startup Inc",
        "slug": "tech-startup",
        "contactEmail": "contact@techstartup.com",
        "createdAt": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

---

### 2. Get Projects by Organization
```graphql
query GetProjects($organizationSlug: String!) {
  projectsByOrganization(organizationSlug: $organizationSlug) {
    id
    name
    description
    status
    dueDate
    taskCount
    completedTasks
    createdAt
  }
}
```

**Variables:**
```json
{
  "organizationSlug": "tech-startup"
}
```

**Response:**
```json
{
  "data": {
    "projectsByOrganization": [
      {
        "id": "1",
        "name": "Website Redesign",
        "description": "Complete overhaul of company website",
        "status": "ACTIVE",
        "dueDate": "2024-06-30",
        "taskCount": 5,
        "completedTasks": 2,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

### 3. Get Single Project
```graphql
query GetProject($id: ID!) {
  project(id: $id) {
    id
    name
    description
    status
    dueDate
    taskCount
    completedTasks
    organization {
      id
      name
      slug
    }
  }
}
```

**Variables:**
```json
{
  "id": "1"
}
```

---

### 4. Get Tasks by Project
```graphql
query GetTasks($projectId: ID!) {
  tasksByProject(projectId: $projectId) {
    id
    title
    description
    status
    assigneeEmail
    dueDate
    createdAt
  }
}
```

**Variables:**
```json
{
  "projectId": "1"
}
```

**Response:**
```json
{
  "data": {
    "tasksByProject": [
      {
        "id": "1",
        "title": "Design Homepage",
        "description": "Create mockups for new homepage",
        "status": "IN_PROGRESS",
        "assigneeEmail": "designer@techstartup.com",
        "dueDate": "2024-02-15T00:00:00Z",
        "createdAt": "2024-01-20T10:00:00Z"
      }
    ]
  }
}
```

---

### 5. Get Comments by Task
```graphql
query GetComments($taskId: ID!) {
  commentsByTask(taskId: $taskId) {
    id
    content
    authorEmail
    createdAt
  }
}
```

**Variables:**
```json
{
  "taskId": "1"
}
```

---

## Mutations

### 1. Create Project
```graphql
mutation CreateProject(
  $organizationSlug: String!
  $name: String!
  $description: String
  $status: String
  $dueDate: Date
) {
  createProject(
    organizationSlug: $organizationSlug
    name: $name
    description: $description
    status: $status
    dueDate: $dueDate
  ) {
    project {
      id
      name
      description
      status
      dueDate
    }
  }
}
```

**Variables:**
```json
{
  "organizationSlug": "tech-startup",
  "name": "Mobile App Development",
  "description": "Build iOS and Android apps",
  "status": "ACTIVE",
  "dueDate": "2024-12-31"
}
```

**Response:**
```json
{
  "data": {
    "createProject": {
      "project": {
        "id": "2",
        "name": "Mobile App Development",
        "description": "Build iOS and Android apps",
        "status": "ACTIVE",
        "dueDate": "2024-12-31"
      }
    }
  }
}
```

---

### 2. Update Project
```graphql
mutation UpdateProject(
  $id: ID!
  $name: String
  $description: String
  $status: String
  $dueDate: Date
) {
  updateProject(
    id: $id
    name: $name
    description: $description
    status: $status
    dueDate: $dueDate
  ) {
    project {
      id
      name
      description
      status
      dueDate
    }
  }
}
```

**Variables:**
```json
{
  "id": "2",
  "status": "COMPLETED"
}
```

---

### 3. Create Task
```graphql
mutation CreateTask(
  $projectId: ID!
  $title: String!
  $description: String
  $status: String
  $assigneeEmail: String
  $dueDate: DateTime
) {
  createTask(
    projectId: $projectId
    title: $title
    description: $description
    status: $status
    assigneeEmail: $assigneeEmail
    dueDate: $dueDate
  ) {
    task {
      id
      title
      description
      status
      assigneeEmail
      dueDate
    }
  }
}
```

**Variables:**
```json
{
  "projectId": "1",
  "title": "Implement Authentication",
  "description": "Add JWT-based auth system",
  "status": "TODO",
  "assigneeEmail": "dev@techstartup.com",
  "dueDate": "2024-03-15T12:00:00Z"
}
```

---

### 4. Update Task
```graphql
mutation UpdateTask(
  $id: ID!
  $title: String
  $description: String
  $status: String
  $assigneeEmail: String
  $dueDate: DateTime
) {
  updateTask(
    id: $id
    title: $title
    description: $description
    status: $status
    assigneeEmail: $assigneeEmail
    dueDate: $dueDate
  ) {
    task {
      id
      title
      status
    }
  }
}
```

**Variables:**
```json
{
  "id": "1",
  "status": "DONE"
}
```

---

### 5. Create Comment
```graphql
mutation CreateComment(
  $taskId: ID!
  $content: String!
  $authorEmail: String!
) {
  createComment(
    taskId: $taskId
    content: $content
    authorEmail: $authorEmail
  ) {
    comment {
      id
      content
      authorEmail
      createdAt
    }
  }
}
```

**Variables:**
```json
{
  "taskId": "1",
  "content": "Great progress on the homepage design!",
  "authorEmail": "manager@techstartup.com"
}
```

---

## Error Handling

### Error Response Format
```json
{
  "errors": [
    {
      "message": "Project matching query does not exist.",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["project"]
    }
  ],
  "data": {
    "project": null
  }
}
```

### Common Error Codes

| Error | Description | Solution |
|-------|-------------|----------|
| `Project matching query does not exist` | Invalid project ID | Check project exists and ID is correct |
| `Organization matching query does not exist` | Invalid organization slug | Verify organization slug |
| `Field required` | Missing required field | Check mutation variables |



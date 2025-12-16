// Enum types for better type safety
export enum ProjectStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    ON_HOLD = 'ON_HOLD',
  }
  
  export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
  }
  
  // Base interface for common fields
  interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt?: string;
  }
  
  // Organization
  export interface Organization extends BaseEntity {
    name: string;
    slug: string;
    contactEmail: string;
  }
  
  // Project
  export interface Project extends BaseEntity {
    name: string;
    description: string;
    status: ProjectStatus;
    dueDate?: string;
    taskCount: number;
    completedTasks: number;
    organization?: Organization;
  }
  
  // Task
  export interface Task extends BaseEntity {
    title: string;
    description: string;
    status: TaskStatus;
    assigneeEmail: string;
    dueDate?: string;
    project?: Project;
  }
  
  // Task Comment
  export interface TaskComment extends BaseEntity {
    content: string;
    authorEmail: string;
    task?: Task;
  }
  
  // Form input types
  export interface CreateProjectInput {
    organizationSlug: string;
    name: string;
    description?: string;
    status?: ProjectStatus;
    dueDate?: string;
  }
  
  export interface UpdateProjectInput {
    id: string;
    name?: string;
    description?: string;
    status?: ProjectStatus;
    dueDate?: string;
  }
  
  export interface CreateTaskInput {
    projectId: string;
    title: string;
    description?: string;
    status?: TaskStatus;
    assigneeEmail?: string;
    dueDate?: string;
  }
  
  export interface UpdateTaskInput {
    id: string;
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeEmail?: string;
    dueDate?: string;
  }
  
  export interface CreateCommentInput {
    taskId: string;
    content: string;
    authorEmail: string;
  }
  export interface GetOrganizationsData {
    allOrganizations: Organization[];
  }
  
  export interface GetProjectsByOrgData {
    projectsByOrganization: Project[];
  }
  
  export interface GetProjectData {
    project: Project;
  }
  
  export interface GetTasksByProjectData {
    tasksByProject: Task[];
  }
  
  export interface GetCommentsByTaskData {
    commentsByTask: TaskComment[];
  }
  
  // GraphQL Mutation Result Types
  export interface CreateProjectData {
    createProject: {
      project: Project;
    };
  }
  
  export interface UpdateProjectData {
    updateProject: {
      project: Project;
    };
  }
  
  export interface CreateTaskData {
    createTask: {
      task: Task;
    };
  }
  
  export interface UpdateTaskData {
    updateTask: {
      task: Task;
    };
  }
  
  export interface CreateCommentData {
    createComment: {
      comment: TaskComment;
    };
  }
  
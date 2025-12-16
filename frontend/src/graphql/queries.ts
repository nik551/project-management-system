import { gql } from '@apollo/client';

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    allOrganizations {
      id
      name
      slug
      contactEmail
    }
  }
`;

export const GET_PROJECTS_BY_ORG = gql`
  query GetProjectsByOrganization($organizationSlug: String!) {
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
`;

export const GET_PROJECT = gql`
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
`;

export const GET_TASKS_BY_PROJECT = gql`
  query GetTasksByProject($projectId: ID!) {
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
`;

export const GET_COMMENTS_BY_TASK = gql`
  query GetCommentsByTask($taskId: ID!) {
    commentsByTask(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
    }
  }
`;
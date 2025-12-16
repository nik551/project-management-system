import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from "@apollo/client/testing/react";
import TaskBoard from './TaskBoard'
import { TaskStatus } from '../../types'
import type { Task } from '../../types'

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Todo Task',
    description: 'Todo description',
    status: TaskStatus.TODO,
    assigneeEmail: 'user@example.com',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'In Progress Task',
    description: 'In progress description',
    status: TaskStatus.IN_PROGRESS,
    assigneeEmail: 'user@example.com',
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    title: 'Done Task',
    description: 'Done description',
    status: TaskStatus.DONE,
    assigneeEmail: 'user@example.com',
    createdAt: '2024-01-03',
  },
]

describe('TaskBoard', () => {
  const mockOnTaskUpdate = vi.fn()

  it('renders three columns', () => {
    render(
      <MockedProvider>
        <TaskBoard tasks={[]} onTaskUpdate={mockOnTaskUpdate} />
      </MockedProvider>
    )
    
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('displays task counts in column headers', () => {
    render(
      <MockedProvider>
        <TaskBoard tasks={mockTasks} onTaskUpdate={mockOnTaskUpdate} />
      </MockedProvider>
    )
    
    // Each column should show count of 1
    const countBadges = screen.getAllByText('1')
    expect(countBadges).toHaveLength(3)
  })

  it('distributes tasks to correct columns', () => {
    render(
      <MockedProvider>
        <TaskBoard tasks={mockTasks} onTaskUpdate={mockOnTaskUpdate} />
      </MockedProvider>
    )
    
    expect(screen.getByText('Todo Task')).toBeInTheDocument()
    expect(screen.getByText('In Progress Task')).toBeInTheDocument()
    expect(screen.getByText('Done Task')).toBeInTheDocument()
  })

  it('shows "No tasks" when column is empty', () => {
    render(
      <MockedProvider>
        <TaskBoard tasks={[]} onTaskUpdate={mockOnTaskUpdate} />
      </MockedProvider>
    )
    
    const noTasksMessages = screen.getAllByText(/no tasks/i)
    expect(noTasksMessages).toHaveLength(3) // One for each column
  })
})
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProjectList from './ProjectList'
import { ProjectStatus } from '../../types'
import type { Project } from '../../types'

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Test Project 1',
    description: 'Test Description 1',
    status: ProjectStatus.ACTIVE,
    taskCount: 5,
    completedTasks: 2,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Test Project 2',
    description: 'Test Description 2',
    status: ProjectStatus.COMPLETED,
    taskCount: 3,
    completedTasks: 3,
    createdAt: '2024-01-02',
  },
]

describe('ProjectList', () => {
  it('renders empty state when no projects', () => {
    render(
      <BrowserRouter>
        <ProjectList projects={[]} />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/no projects/i)).toBeInTheDocument()
    expect(screen.getByText(/get started by creating a new project/i)).toBeInTheDocument()
  })

  it('renders project cards', () => {
    render(
      <BrowserRouter>
        <ProjectList projects={mockProjects} />
      </BrowserRouter>
    )

    expect(screen.getByText('Test Project 1')).toBeInTheDocument()
    expect(screen.getByText('Test Project 2')).toBeInTheDocument()
  })

  it('displays project status badges', () => {
    render(
      <BrowserRouter>
        <ProjectList projects={mockProjects} />
      </BrowserRouter>
    )

    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
  })

  it('displays task counts correctly', () => {
    render(
      <BrowserRouter>
        <ProjectList projects={mockProjects} />
      </BrowserRouter>
    )

    expect(screen.getByText(/2\/5 tasks/i)).toBeInTheDocument()
    expect(screen.getByText(/3\/3 tasks/i)).toBeInTheDocument()
  })

  it('calculates progress correctly', () => {
    render(
      <BrowserRouter>
        <ProjectList projects={mockProjects} />
      </BrowserRouter>
    )

    // Project 1: 2/5 = 40%
    expect(screen.getByText('40%')).toBeInTheDocument()
    
    // Project 2: 3/3 = 100%
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})
import { describe, it, expect } from 'vitest'
import { ProjectStatus, TaskStatus } from './index'

describe('TypeScript Types', () => {
  describe('ProjectStatus', () => {
    it('has correct enum values', () => {
      expect(ProjectStatus.ACTIVE).toBe('ACTIVE')
      expect(ProjectStatus.COMPLETED).toBe('COMPLETED')
      expect(ProjectStatus.ON_HOLD).toBe('ON_HOLD')
    })
  })

  describe('TaskStatus', () => {
    it('has correct enum values', () => {
      expect(TaskStatus.TODO).toBe('TODO')
      expect(TaskStatus.IN_PROGRESS).toBe('IN_PROGRESS')
      expect(TaskStatus.DONE).toBe('DONE')
    })
  })
})
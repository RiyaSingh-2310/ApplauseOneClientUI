import type { ProjectStatus } from './common'

export interface AssignedProject {
  id: string
  name: string
  description: string
  assignedAt: string
  status: ProjectStatus
  points: number | null
  estimatedMinutes: number
  surveyUrl: string | null
  sponsor?: string
}

export interface ProjectQuery {
  sort?: 'assignedAt:desc' | 'assignedAt:asc'
}

import type { PaginatedResponse } from '@/types/common'
import type { AssignedProject, ProjectQuery } from '@/types/project'
import { apiRequest } from './http'

export const projectService = {
  getAssigned(query: ProjectQuery = { sort: 'assignedAt:desc' }) {
    const params = new URLSearchParams({ sort: query.sort ?? 'assignedAt:desc' })
    return apiRequest<PaginatedResponse<AssignedProject>>(`/projects/assigned?${params.toString()}`)
  },
}

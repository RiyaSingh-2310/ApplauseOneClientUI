import type { PaginatedResponse } from '@/types/common'
import type { AssignedProject, ProjectQuery } from '@/types/project'

export const projectService = {
  getAssigned(_query: ProjectQuery = { sort: 'assignedAt:desc' }): Promise<PaginatedResponse<AssignedProject>> {
    void _query
    return Promise.resolve({ items: [], total: 0 })
  },
}

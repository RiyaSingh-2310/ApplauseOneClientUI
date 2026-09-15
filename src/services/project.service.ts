import type { PaginatedResponse } from '@/types/common'
import type { AssignedProject, ProjectQuery } from '@/types/project'

export const projectService = {
  // The public panelist API does not currently expose assigned projects.
  getAssigned(_query: ProjectQuery = { sort: 'assignedAt:desc' }): Promise<PaginatedResponse<AssignedProject>> {
    void _query
    return Promise.resolve({ items: [], total: 0 })
  },
}

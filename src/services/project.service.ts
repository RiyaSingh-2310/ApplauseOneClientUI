import type { PaginatedResponse } from '@/types/common'
import type { AssignedProject, ProjectQuery } from '@/types/project'
import { surveyService } from './survey.service'

export const projectService = {
  getAssigned(query: ProjectQuery = { sort: 'assignedAt:desc' }): Promise<PaginatedResponse<AssignedProject>> {
    return surveyService.list(query)
  },
  getById(id: string | number) {
    return surveyService.getById(id)
  },
}

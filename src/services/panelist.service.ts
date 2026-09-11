import type { ActivityItem, DashboardSummary, PanelistProfile, ProfileUpdatePayload } from '@/types/panelist'
import type { AssignedProject } from '@/types/project'
import { apiRequest } from './http'

export interface PointsTrendPoint {
  label: string
  points: number
}

export interface DashboardResponse {
  summary: DashboardSummary
  activity: ActivityItem[]
  latestProjects: AssignedProject[]
  pointsTrend: PointsTrendPoint[]
}

export const panelistService = {
  getProfile() {
    return apiRequest<PanelistProfile>('/panelist/profile')
  },
  updateProfile(payload: ProfileUpdatePayload) {
    return apiRequest<PanelistProfile>('/panelist/profile', {
      method: 'PATCH',
      body: payload,
    })
  },
  getDashboard() {
    return apiRequest<DashboardResponse>('/panelist/dashboard')
  },
}

export interface PanelistProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  zipCode: string
  ageRange: string
  gender: string
  householdIncome: string
  educationLevel: string
  employmentStatus: string
  householdSize: string
  shoppingMethod: string
  monthlyBudget: string
  primaryDevice: string
  shoppingInterests: string[]
  surveyTime: string
  surveyFrequency: string
  motivation: string
  emailInvitations: boolean
  opportunityUpdates: boolean
  earningTips: boolean
  memberSince: string
}

export interface DashboardSummary {
  availablePoints: number
  redeemedPoints: number
  pendingRequests: number
  assignedProjects: number
  nextRewardAt: number
  pointsThisMonth: number
}

export interface ActivityItem {
  id: string
  title: string
  detail: string
  occurredAt: string
  kind: 'project' | 'reward' | 'points' | 'profile'
}

export interface ProfileUpdatePayload {
  phone?: string
  zipCode?: string
  surveyTime?: string
  surveyFrequency?: string
  motivation?: string
  emailInvitations?: boolean
  opportunityUpdates?: boolean
  earningTips?: boolean
  shoppingInterests?: string[]
  primaryDevice?: string
}

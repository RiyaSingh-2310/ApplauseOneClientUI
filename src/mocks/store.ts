import type { AuthUser } from '@/types/auth'
import type { ActivityItem, DashboardSummary, PanelistProfile } from '@/types/panelist'
import type { AssignedProject } from '@/types/project'
import type { RewardOption, RewardRequest, RewardTransaction } from '@/types/reward'
import {
  DEMO_PASSWORD,
  demoActivity,
  demoHistory,
  demoProfile,
  demoProjects,
  demoRequests,
  demoRewards,
  demoSummary,
  demoUser,
} from './seed'

const STORAGE_KEY = 'ao.panelist.mock.v2'

interface MockState {
  users: Array<AuthUser & { password: string }>
  profile: PanelistProfile
  summary: DashboardSummary
  projects: AssignedProject[]
  rewards: RewardOption[]
  requests: RewardRequest[]
  history: RewardTransaction[]
  activity: ActivityItem[]
}

function seedState(): MockState {
  return {
    users: [{ ...demoUser, password: DEMO_PASSWORD }],
    profile: structuredClone(demoProfile),
    summary: structuredClone(demoSummary),
    projects: structuredClone(demoProjects),
    rewards: structuredClone(demoRewards),
    requests: structuredClone(demoRequests),
    history: structuredClone(demoHistory),
    activity: structuredClone(demoActivity),
  }
}

function loadState(): MockState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState()
    return JSON.parse(raw) as MockState
  } catch {
    return seedState()
  }
}

let state = loadState()

function persist() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const mockStore = {
  getState() {
    return state
  },
  reset() {
    state = seedState()
    persist()
  },
  findUser(email: string) {
    return state.users.find((user) => user.email.toLowerCase() === email.toLowerCase())
  },
  addUser(user: AuthUser, password: string, profile: PanelistProfile) {
    state.users.push({ ...user, password })
    state.profile = profile
    persist()
  },
  updateProfile(patch: Partial<PanelistProfile>) {
    state.profile = { ...state.profile, ...patch }
    persist()
    return state.profile
  },
  addRequest(request: RewardRequest) {
    state.requests = [request, ...state.requests]
    state.summary.availablePoints -= request.pointsUsed
    state.summary.pendingRequests += 1
    state.history = [
      {
        id: `txn_${Date.now()}`,
        rewardName: request.rewardName,
        points: request.pointsUsed,
        occurredAt: request.requestedAt,
        type: 'redeemed',
        status: 'pending',
        category: request.category,
      },
      ...state.history,
    ]
    state.activity = [
      {
        id: `act_${Date.now()}`,
        title: 'Reward request submitted',
        detail: `${request.rewardName} · ${request.pointsUsed} points`,
        occurredAt: request.requestedAt,
        kind: 'reward',
      },
      ...state.activity,
    ]
    persist()
    return request
  },
}

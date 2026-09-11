import type { AuthSession, ForgotPasswordPayload, LoginPayload, RegisterPayload } from '@/types/auth'
import type { ContactPayload } from '@/types/contact'
import type { ProfileUpdatePayload } from '@/types/panelist'
import type { RedeemRewardPayload } from '@/types/reward'
import { ApiRequestError } from '@/services/errors'
import { createMockToken, decodeMockToken } from '@/services/token'
import { pointsGuide } from './seed'
import { mockStore } from './store'

function wait(ms = 520) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function fail(message: string, fieldErrors?: Record<string, string>): never {
  throw new ApiRequestError({ message, fieldErrors })
}

function requireUser(token?: string) {
  const decoded = token ? decodeMockToken(token) : null
  if (!decoded) fail('Your session has expired. Please sign in again.')
  const user = mockStore.findUser(decoded.email)
  if (!user) fail('Your session has expired. Please sign in again.')
  return user
}

export async function mockRequest<T>(method: string, path: string, body?: unknown, token?: string): Promise<T> {
  await wait()
  const key = `${method} ${path.split('?')[0]}`
  const storedToken = token ?? (sessionStorage.getItem('ao.auth.token') || localStorage.getItem('ao.auth.token') || undefined)

  switch (key) {
    case 'POST /auth/login': {
      const payload = body as LoginPayload
      const user = mockStore.findUser(payload.email)
      if (!user || user.password !== payload.password) {
        fail('We could not find a matching email and password.')
      }
      const session: AuthSession = {
        token: createMockToken(user.id, user.email),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      }
      return session as T
    }
    case 'POST /auth/register': {
      const payload = body as RegisterPayload
      if (mockStore.findUser(payload.email)) {
        fail('An account with this email already exists.', { email: 'This email is already registered.' })
      }
      const user = {
        id: `pnl_${Date.now()}`,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      }
      mockStore.addUser(user, payload.password, {
        id: user.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        zipCode: payload.zipCode,
        ageRange: payload.ageRange,
        gender: payload.gender,
        householdIncome: payload.householdIncome,
        educationLevel: payload.educationLevel,
        employmentStatus: payload.employmentStatus,
        householdSize: payload.householdSize,
        shoppingMethod: payload.shoppingMethod,
        monthlyBudget: payload.monthlyBudget,
        primaryDevice: payload.primaryDevice,
        shoppingInterests: payload.shoppingInterests,
        surveyTime: payload.surveyTime,
        surveyFrequency: payload.surveyFrequency,
        motivation: payload.motivation,
        emailInvitations: payload.emailInvitations,
        opportunityUpdates: payload.opportunityUpdates,
        earningTips: payload.earningTips,
        memberSince: new Date().toISOString(),
      })
      const session: AuthSession = {
        token: createMockToken(user.id, user.email),
        user,
      }
      return session as T
    }
    case 'POST /auth/forgot-password': {
      const payload = body as ForgotPasswordPayload
      if (!payload.email) fail('Please enter the email on your account.')
      return { ok: true } as T
    }
    case 'GET /auth/me': {
      const user = requireUser(storedToken)
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      } as T
    }
    case 'GET /panelist/profile': {
      requireUser(storedToken)
      return mockStore.getState().profile as T
    }
    case 'PATCH /panelist/profile': {
      requireUser(storedToken)
      return mockStore.updateProfile(body as ProfileUpdatePayload) as T
    }
    case 'GET /panelist/dashboard': {
      requireUser(storedToken)
      const { summary, activity, projects } = mockStore.getState()
      return {
        summary,
        activity,
        latestProjects: [...projects].sort(
          (a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime(),
        ).slice(0, 3),
        pointsTrend: [
          { label: 'May', points: 240 },
          { label: 'Jun', points: 310 },
          { label: 'Jul', points: 280 },
          { label: 'Aug', points: 410 },
          { label: 'Sep', points: summary.pointsThisMonth },
        ],
      } as T
    }
    case 'GET /projects/assigned': {
      requireUser(storedToken)
      const params = new URLSearchParams(path.includes('?') ? path.split('?')[1] : '')
      const sort = params.get('sort') ?? 'assignedAt:desc'
      const items = [...mockStore.getState().projects].sort((a, b) => {
        const delta = new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
        return sort === 'assignedAt:asc' ? -delta : delta
      })
      return { items, total: items.length } as T
    }
    case 'GET /rewards': {
      return {
        items: mockStore.getState().rewards,
        guide: pointsGuide,
      } as T
    }
    case 'POST /rewards/redeem': {
      requireUser(storedToken)
      const payload = body as RedeemRewardPayload
      const reward = mockStore.getState().rewards.find((item) => item.id === payload.rewardId)
      if (!reward) fail('That reward is no longer available.')
      if (!reward.available) fail('This reward is not available yet.')
      if (mockStore.getState().summary.availablePoints < reward.pointsRequired) {
        fail('You do not have enough points for this reward.')
      }
      return mockStore.addRequest({
        id: `req_${Date.now()}`,
        rewardId: reward.id,
        rewardName: reward.name,
        category: reward.category,
        pointsUsed: reward.pointsRequired,
        requestedAt: new Date().toISOString(),
        status: 'pending',
      }) as T
    }
    case 'GET /reward-requests': {
      requireUser(storedToken)
      return { items: mockStore.getState().requests, total: mockStore.getState().requests.length } as T
    }
    case 'GET /reward-history': {
      requireUser(storedToken)
      const params = new URLSearchParams(path.includes('?') ? path.split('?')[1] : '')
      const status = params.get('status')
      const type = params.get('type')
      const from = params.get('from')
      const to = params.get('to')
      const items = mockStore.getState().history.filter((item) => {
        if (status && status !== 'all' && item.status !== status) return false
        if (type && type !== 'all' && item.type !== type) return false
        if (from && new Date(item.occurredAt) < new Date(from)) return false
        if (to && new Date(item.occurredAt) > new Date(`${to}T23:59:59`)) return false
        return true
      })
      return { items, total: items.length } as T
    }
    case 'POST /contact': {
      const payload = body as ContactPayload
      if (!payload.email || !payload.message) fail('Please complete the required fields.')
      return { ok: true } as T
    }
    default:
      fail(`No mock handler for ${key}`)
  }
}

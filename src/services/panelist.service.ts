import type { RewardBalance, RewardRequestRecord, RewardTransactionRecord } from '@/types/api'
import type { ActivityItem, DashboardSummary, ProfilePageData } from '@/types/panelist'
import type { AssignedProject } from '@/types/project'
import { asNumber, parseApiDate } from '@/lib/utils'
import { mapTransaction } from '@/lib/apiMap'
import { authService } from './auth.service'
import { onboardingService } from './onboarding.service'
import { rewardRequestService } from './rewardRequest.service'
import { rewardService } from './reward.service'

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

function monthKey(value: string) {
  const date = parseApiDate(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(parseApiDate(value))
}

function buildTrend(transactions: RewardTransactionRecord[]): PointsTrendPoint[] {
  const buckets = new Map<string, { label: string; points: number }>()
  for (const item of [...transactions].reverse()) {
    const key = monthKey(item.created_at)
    const current = buckets.get(key) ?? { label: monthLabel(item.created_at), points: 0 }
    if (item.transaction_type === 'credit') current.points += asNumber(item.reward_points)
    buckets.set(key, current)
  }
  return [...buckets.values()].slice(-6)
}

function activityFromTransactions(transactions: RewardTransactionRecord[]): ActivityItem[] {
  return transactions.slice(0, 8).map((item) => {
    const mapped = mapTransaction(item)
    return {
      id: String(item.id),
      title: item.remark || item.reward_type || 'Points update',
      detail:
        mapped.type === 'redeemed'
          ? `${Math.abs(mapped.points)} points redeemed`
          : `${mapped.points} points added`,
      occurredAt: item.created_at,
      kind: mapped.type === 'redeemed' ? 'reward' : 'points',
    }
  })
}

export const panelistService = {
  async getProfile(): Promise<ProfilePageData> {
    const [user, questions, answers] = await Promise.all([
      authService.me(),
      onboardingService.getQuestions(),
      onboardingService.getAnswers(),
    ])
    return {
      user,
      steps: questions.steps,
      answers: answers.answers ?? [],
    }
  },
  updateProfile(payload: { name?: string; phone?: string }) {
    return authService.updateMe(payload)
  },
  async getDashboard(): Promise<DashboardResponse> {
    const [balance, tx, requests] = await Promise.all([
      rewardService.getBalance(),
      rewardService.getTransactions(),
      rewardRequestService.listRecords(),
    ])
    return composeDashboard(balance, tx, requests)
  },
}

export function composeDashboard(
  balance: RewardBalance,
  transactions: RewardTransactionRecord[],
  requests: RewardRequestRecord[],
): DashboardResponse {
  const now = new Date()
  const redeemedPoints = transactions
    .filter((item) => item.transaction_type === 'debit')
    .reduce((sum, item) => sum + asNumber(item.reward_points), 0)
  const pointsThisMonth = transactions
    .filter((item) => {
      if (item.transaction_type !== 'credit') return false
      const date = parseApiDate(item.created_at)
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
    })
    .reduce((sum, item) => sum + asNumber(item.reward_points), 0)

  return {
    summary: {
      availablePoints: asNumber(balance.balance_point),
      redeemedPoints,
      pendingRequests: requests.filter((item) => item.status === 'pending').length,
      assignedProjects: 0,
      nextRewardAt: asNumber(balance.minimum_payout) || 1,
      pointsThisMonth,
    },
    activity: activityFromTransactions(transactions),
    latestProjects: [],
    pointsTrend: buildTrend(transactions),
  }
}

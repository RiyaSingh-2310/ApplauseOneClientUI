import type { RewardAvailability, RewardCategory, RewardRequestStatus, TransactionType } from './common'

export interface RewardRedemptionRequirement {
  pointsRequired: number
  delivery: string
}

export interface RewardOption {
  id: string
  name: string
  category: RewardCategory
  description: string
  pointsRequired: number
  delivery: string
  available: boolean
  availability?: RewardAvailability
  accent: string
  logoLabel: string
  estimatedValueLabel: string
}

export interface RedeemRewardPayload {
  rewardId: string
  destinationNote?: string
}

export interface RewardRequest {
  id: string
  rewardId: string
  rewardName: string
  category: RewardCategory
  pointsUsed: number
  requestedAt: string
  status: RewardRequestStatus
}

export interface RewardTransaction {
  id: string
  rewardName: string
  points: number
  occurredAt: string
  type: TransactionType
  status: RewardRequestStatus | 'posted'
  category?: RewardCategory
}

export interface RewardHistoryQuery {
  status?: string
  type?: string
  from?: string
  to?: string
}

export interface PointsGuide {
  headline: string
  body: string
  minimumRedemption: number
  notes: string[]
}

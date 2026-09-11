import type { PointsGuide, RedeemRewardPayload, RewardOption, RewardRequest } from '@/types/reward'
import { apiRequest } from './http'

export interface RewardCatalogResponse {
  items: RewardOption[]
  guide: PointsGuide
}

export const rewardService = {
  getCatalog() {
    return apiRequest<RewardCatalogResponse>('/rewards', { auth: false })
  },
  redeem(payload: RedeemRewardPayload) {
    return apiRequest<RewardRequest>('/rewards/redeem', {
      method: 'POST',
      body: payload,
    })
  },
}

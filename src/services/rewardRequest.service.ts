import type { PaginatedResponse } from '@/types/common'
import type { RewardHistoryQuery, RewardRequest, RewardTransaction } from '@/types/reward'
import { apiRequest } from './http'

export const rewardRequestService = {
  list() {
    return apiRequest<PaginatedResponse<RewardRequest>>('/reward-requests')
  },
  history(query: RewardHistoryQuery = {}) {
    const params = new URLSearchParams()
    if (query.status) params.set('status', query.status)
    if (query.type) params.set('type', query.type)
    if (query.from) params.set('from', query.from)
    if (query.to) params.set('to', query.to)
    const suffix = params.toString()
    return apiRequest<PaginatedResponse<RewardTransaction>>(
      `/reward-history${suffix ? `?${suffix}` : ''}`,
    )
  },
}

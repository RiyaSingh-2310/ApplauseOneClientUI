import type { PublicSettings, RewardBalance, RewardRequestRecord, RewardTransactionRecord } from '@/types/api'
import type { PointsGuide, RedeemRewardPayload, RewardOption, RewardRequest } from '@/types/reward'
import { hydrateInstantCash } from '@/lib/rewards'
import { asNumber } from '@/lib/utils'
import { unwrapCollection } from '@/lib/apiMap'
import { apiRequest } from './http'

export interface RewardCatalogResponse {
  items: RewardOption[]
  guide: PointsGuide
  balancePoint?: number
}

function guideFromMinimum(minimum: number): PointsGuide {
  return {
    headline: 'Redemption minimum',
    body: 'Point requirements come from the current payout settings. Each request is reviewed before it is paid.',
    minimumRedemption: minimum,
    notes: [],
  }
}

function catalogFromMethods(
  methods: PublicSettings['payment_methods'],
  minimum: number,
  settings?: Pick<PublicSettings, 'paypal_enabled'>,
): RewardOption[] {
  const list = methods ?? []
  const rest = paymentMethodsToRewards(
    list.filter((method) => paymentMethodCategory(method.name) !== 'cash'),
    minimum,
  )
  return [...hydrateInstantCash(minimum, list, settings), ...rest]
}

export const rewardService = {
  async getCatalog(): Promise<RewardCatalogResponse> {
    const settings = await apiRequest<PublicSettings>('/settings', { auth: false })
    const minimum = asNumber(settings.minimum_payout)
    return {
      items: catalogFromMethods(settings.payment_methods, minimum, settings),
      guide: guideFromMinimum(minimum),
    }
  },
  getBalance() {
    return apiRequest<RewardBalance>('/rewards/balance')
  },
  async getMemberCatalog(): Promise<RewardCatalogResponse> {
    const balance = await apiRequest<RewardBalance>('/rewards/balance')
    const minimum = asNumber(balance.minimum_payout)
    return {
      items: catalogFromMethods(balance.payment_methods, minimum),
      guide: guideFromMinimum(minimum),
      balancePoint: asNumber(balance.balance_point),
    }
  },
  getTransactions() {
    return apiRequest<unknown>('/rewards/transactions').then((data) =>
      unwrapCollection<RewardTransactionRecord>(data, ['transactions', 'items']),
    )
  },
  async redeem(payload: RedeemRewardPayload): Promise<RewardRequest> {
    const method = payload.paymentMethod ?? payload.rewardName
    const data = await apiRequest<RewardRequestRecord & { request?: RewardRequestRecord }>('/rewards/requests', {
      method: 'POST',
      body: {
        reward_points: payload.rewardPoints,
        payment_method: method,
        payment_methord: method,
        remark: payload.remark ?? payload.rewardName,
      },
    })
    const record = data.request ?? data
    if (record?.id) return mapRewardRequest(record)
    return {
      id: payload.rewardId,
      rewardId: payload.rewardId,
      rewardName: payload.rewardName,
      category: 'cash',
      pointsUsed: payload.rewardPoints,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    }
  },
}

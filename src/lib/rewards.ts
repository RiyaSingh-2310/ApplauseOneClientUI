import { instantCashRewards } from '@/content/rewards'
import type { PaymentMethod, PublicSettings } from '@/types/api'
import type { RewardAvailability } from '@/types/common'
import type { RewardOption } from '@/types/reward'

export function getRewardAvailability(reward: RewardOption): RewardAvailability {
  if (reward.availability) return reward.availability
  return reward.available ? 'available' : 'coming-soon'
}

function hasMethod(methods: PaymentMethod[], name: string) {
  return methods.some((method) => method.name.toLowerCase() === name.toLowerCase())
}

export function hydrateInstantCash(
  minimumPayout: number,
  methods: PaymentMethod[],
  settings?: Pick<PublicSettings, 'paypal_enabled'>,
): RewardOption[] {
  const paypalAvailable = hasMethod(methods, 'Paypal') || settings?.paypal_enabled === 1
  const cashAvailable = hasMethod(methods, 'Cash')

  return instantCashRewards.map((reward) => ({
    ...reward,
    pointsRequired: minimumPayout,
    estimatedValueLabel: `${minimumPayout}+ points`,
    available: reward.id === 'rwd_paypal' ? paypalAvailable : cashAvailable,
  }))
}

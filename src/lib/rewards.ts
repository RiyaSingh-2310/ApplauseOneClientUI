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

/**
 * The payout API exposes one "Gift Card" method. When Amazon is enabled, surface
 * one additional gift card that still redeems through that same method.
 */
export function appendFeaturedGiftCard(
  items: RewardOption[],
  methods: PaymentMethod[],
  settings?: Pick<PublicSettings, 'amazon_enabled'>,
): RewardOption[] {
  const giftCardEnabled = methods.some((method) => method.name.toLowerCase().includes('gift'))
  if (!giftCardEnabled || settings?.amazon_enabled === 0) return items
  if (items.some((item) => item.id === 'rwd_amazon' || item.name.toLowerCase().includes('amazon'))) return items

  const giftCard = items.find((item) => item.category === 'gift-card')
  const minimum = giftCard?.pointsRequired ?? items[0]?.pointsRequired ?? 0

  return [
    ...items,
    {
      id: 'rwd_amazon',
      name: 'Amazon Gift Card',
      category: 'gift-card',
      description: 'Redeem points for an Amazon gift card. Requests are reviewed before the code is issued.',
      pointsRequired: minimum,
      delivery: giftCard?.delivery ?? 'Processed after review',
      available: true,
      popular: true,
      accent: '#c4a35a',
      logoLabel: 'AZ',
      estimatedValueLabel: `${minimum}+ points`,
      paymentMethod: 'Gift Card',
    },
  ]
}

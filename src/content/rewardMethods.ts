import amazonImg from '@/assets/rewards/amazon.svg'
import amazonPayImg from '@/assets/rewards/amazon-pay.svg'
import flipkartImg from '@/assets/rewards/flipkart.svg'
import myntraImg from '@/assets/rewards/myntra.svg'
import gpayImg from '@/assets/rewards/gpay.svg'
import upiImg from '@/assets/rewards/upi.svg'
import paypalImg from '@/assets/rewards/paypal.svg'
import bankTransferImg from '@/assets/rewards/bank-transfer.svg'
import cashRewardImg from '@/assets/rewards/cash-reward.svg'

/**
 * Shared reward-method catalog for Home showcase + redemption dropdown.
 * `apiValue` matches existing ApplauseOneAPI payment_methord strings
 * (dropdown_master / createRequest), not display labels.
 */
export interface RewardMethod {
  id: string
  name: string
  image: string
  /** Value sent as payment_method / payment_methord */
  apiValue: string
  shortLabel?: string
}

export const rewardMethods: RewardMethod[] = [
  { id: 'amazon', name: 'Amazon', image: amazonImg, apiValue: 'Gift Card', shortLabel: 'Gift card' },
  { id: 'amazon-pay', name: 'Amazon Pay', image: amazonPayImg, apiValue: 'Gift Card', shortLabel: 'Gift card' },
  { id: 'flipkart', name: 'Flipkart', image: flipkartImg, apiValue: 'Gift Card', shortLabel: 'Gift card' },
  { id: 'myntra', name: 'Myntra', image: myntraImg, apiValue: 'Gift Card', shortLabel: 'Gift card' },
  { id: 'gpay', name: 'Google Pay', image: gpayImg, apiValue: 'UIP', shortLabel: 'UPI' },
  { id: 'upi', name: 'UPI', image: upiImg, apiValue: 'UIP', shortLabel: 'UPI' },
  { id: 'paypal', name: 'PayPal', image: paypalImg, apiValue: 'Paypal', shortLabel: 'Cash' },
  { id: 'bank-transfer', name: 'Bank Transfer', image: bankTransferImg, apiValue: 'Cash', shortLabel: 'Cash' },
  { id: 'cash-reward', name: 'Cash Reward', image: cashRewardImg, apiValue: 'Cash', shortLabel: 'Cash' },
]

export function getRewardMethodById(id: string) {
  return rewardMethods.find((method) => method.id === id)
}

/** Map a catalog reward / payment_method string onto a shared method id. */
export function resolveRewardMethodId(paymentMethodOrName?: string) {
  const value = (paymentMethodOrName ?? '').trim().toLowerCase()
  if (!value) return rewardMethods[0]?.id ?? 'paypal'

  if (value.includes('amazon pay') || value === 'amazon-pay') return 'amazon-pay'
  if (value.includes('amazon')) return 'amazon'
  if (value.includes('flipkart')) return 'flipkart'
  if (value.includes('myntra')) return 'myntra'
  if (value.includes('google pay') || value.includes('gpay') || value === 'g pay') return 'gpay'
  if (value.includes('upi') || value === 'uip') return 'upi'
  if (value.includes('paypal')) return 'paypal'
  if (value.includes('bank')) return 'bank-transfer'
  if (value.includes('cash') || value.includes('transfer')) return 'cash-reward'
  if (value.includes('gift')) return 'amazon'

  return 'paypal'
}

export function resolveRewardMethod(paymentMethodOrName?: string) {
  return getRewardMethodById(resolveRewardMethodId(paymentMethodOrName)) ?? rewardMethods[0]
}

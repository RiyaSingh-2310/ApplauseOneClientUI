import amazonImg from '@/assets/rewards/amazon.svg'
import amazonPayImg from '@/assets/rewards/amazon-pay.svg'
import flipkartImg from '@/assets/rewards/flipkart.svg'
import myntraImg from '@/assets/rewards/myntra.svg'
import gpayImg from '@/assets/rewards/gpay.svg'
import upiImg from '@/assets/rewards/upi.svg'
import paypalImg from '@/assets/rewards/paypal.svg'
import bankTransferImg from '@/assets/rewards/bank-transfer.svg'
import cashRewardImg from '@/assets/rewards/cash-reward.svg'
import visaImg from '@/assets/rewards/visa.svg'
import starbucksImg from '@/assets/rewards/starbucks.svg'
import walmartImg from '@/assets/rewards/walmart.svg'
import targetImg from '@/assets/rewards/target.svg'
import doordashImg from '@/assets/rewards/doordash.svg'
import reiImg from '@/assets/rewards/rei.svg'

/**
 * Shared reward-product catalog for Home, trusted partners, and Redeem dropdown.
 * Display fields stay separate from `apiValue` (payment_methord sent to ApplauseOneAPI).
 * There is no Tremendous catalog endpoint on our backend yet — products are curated locally
 * and filtered against live `payment_methods` when available.
 */
export interface RewardMethod {
  id: string
  name: string
  image: string
  /** Value sent as payment_method / payment_methord */
  apiValue: string
  shortLabel?: string
  popular?: boolean
  partner?: boolean
}

export const rewardMethods: RewardMethod[] = [
  { id: 'amazon', name: 'Amazon', image: amazonImg, apiValue: 'Gift Card', shortLabel: 'Gift card', popular: true, partner: true },
  { id: 'amazon-pay', name: 'Amazon Pay', image: amazonPayImg, apiValue: 'Gift Card', shortLabel: 'Gift card', popular: true, partner: true },
  { id: 'flipkart', name: 'Flipkart', image: flipkartImg, apiValue: 'Gift Card', shortLabel: 'Gift card', popular: true, partner: true },
  { id: 'myntra', name: 'Myntra', image: myntraImg, apiValue: 'Gift Card', shortLabel: 'Gift card', popular: true, partner: true },
  { id: 'gpay', name: 'Google Pay', image: gpayImg, apiValue: 'UIP', shortLabel: 'UPI', popular: true, partner: true },
  { id: 'upi', name: 'UPI', image: upiImg, apiValue: 'UIP', shortLabel: 'UPI', popular: true, partner: true },
  { id: 'paypal', name: 'PayPal', image: paypalImg, apiValue: 'Paypal', shortLabel: 'Cash', popular: true, partner: true },
  { id: 'visa', name: 'Virtual Visa', image: visaImg, apiValue: 'Gift Card', shortLabel: 'Prepaid', popular: true, partner: true },
  { id: 'starbucks', name: 'Starbucks', image: starbucksImg, apiValue: 'Gift Card', shortLabel: 'Gift card', popular: true, partner: true },
  { id: 'walmart', name: 'Walmart', image: walmartImg, apiValue: 'Gift Card', shortLabel: 'Gift card', popular: true, partner: true },
  { id: 'target', name: 'Target', image: targetImg, apiValue: 'Gift Card', shortLabel: 'Gift card', popular: true, partner: true },
  { id: 'doordash', name: 'DoorDash', image: doordashImg, apiValue: 'Gift Card', shortLabel: 'Gift card', popular: true, partner: true },
  { id: 'rei', name: 'REI', image: reiImg, apiValue: 'Gift Card', shortLabel: 'Gift card', popular: true, partner: true },
  { id: 'bank-transfer', name: 'Bank Transfer', image: bankTransferImg, apiValue: 'Cash', shortLabel: 'Cash', popular: false, partner: false },
  { id: 'cash-reward', name: 'Cash Reward', image: cashRewardImg, apiValue: 'Cash', shortLabel: 'Cash', popular: false, partner: false },
]

export const popularRewardMethods = rewardMethods.filter((method) => method.popular)
export const partnerRewardMethods = rewardMethods.filter((method) => method.partner)

export function getRewardMethodById(id: string) {
  return rewardMethods.find((method) => method.id === id)
}

/** Map a catalog reward / payment_method string onto a shared method id. */
export function resolveRewardMethodId(paymentMethodOrName?: string) {
  const value = (paymentMethodOrName ?? '').trim().toLowerCase()
  if (!value) return rewardMethods.find((m) => m.id === 'paypal')?.id ?? rewardMethods[0]?.id ?? 'paypal'

  if (value.includes('amazon pay') || value === 'amazon-pay') return 'amazon-pay'
  if (value.includes('amazon')) return 'amazon'
  if (value.includes('flipkart')) return 'flipkart'
  if (value.includes('myntra')) return 'myntra'
  if (value.includes('google pay') || value.includes('gpay') || value === 'g pay') return 'gpay'
  if (value.includes('upi') || value === 'uip') return 'upi'
  if (value.includes('paypal')) return 'paypal'
  if (value.includes('visa')) return 'visa'
  if (value.includes('starbucks')) return 'starbucks'
  if (value.includes('walmart')) return 'walmart'
  if (value.includes('target')) return 'target'
  if (value.includes('doordash')) return 'doordash'
  if (value.includes('rei')) return 'rei'
  if (value.includes('bank')) return 'bank-transfer'
  if (value === 'cash' || value.includes('cash reward')) return 'cash-reward'
  if (value.includes('gift')) return 'amazon'

  return 'paypal'
}

export function resolveRewardMethod(paymentMethodOrName?: string) {
  return getRewardMethodById(resolveRewardMethodId(paymentMethodOrName)) ?? rewardMethods[0]
}

/**
 * Keep products whose apiValue matches an enabled backend payment method name.
 * If the API list is empty/unavailable, fall back to the curated list (display still works;
 * redeem still posts apiValue strings the backend already accepts as free-text).
 */
export function filterRewardMethodsByApi(apiMethodNames: string[] | undefined | null): RewardMethod[] {
  if (!apiMethodNames?.length) return rewardMethods
  const normalized = new Set(apiMethodNames.map((name) => name.trim().toLowerCase()))
  const matched = rewardMethods.filter((method) => normalized.has(method.apiValue.toLowerCase()))
  return matched.length ? matched : rewardMethods
}

export function methodsForRedeemDropdown(apiMethodNames?: string[] | null) {
  return filterRewardMethodsByApi(apiMethodNames)
}

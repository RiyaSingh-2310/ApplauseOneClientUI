import type { RewardAvailability } from '@/types/common'
import type { RewardOption } from '@/types/reward'

export function getRewardAvailability(reward: RewardOption): RewardAvailability {
  if (reward.availability) return reward.availability
  return reward.available ? 'available' : 'coming-soon'
}

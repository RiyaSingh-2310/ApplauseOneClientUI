import type { RewardCategory } from '@/types/common'

export const categoryLabels: Record<RewardCategory, string> = {
  cash: 'Instant Cash',
  'gift-card': 'Gift Cards',
  digital: 'Digital Rewards',
  charity: 'Charity',
}

export const rewardsHero = {
  eyebrow: 'Rewards Catalog',
  titleLead: 'Redeem Your Points for',
  titleAccent: 'Amazing Rewards',
  description:
    'Discover hundreds of ways to turn your survey points into cash, gift cards, and charitable donations. Join members earning real rewards every day.',
  pills: ['Secure & Verified', 'Instant Payouts', 'Global Availability'],
}

export const rewardShowcase = [
  {
    id: 'cash',
    title: 'Instant Cash',
    description: 'Get paid to your account once a request is approved.',
    category: 'cash' as const,
    ids: ['rwd_paypal'],
    comingSoonSlots: 2,
  },
  {
    id: 'gift-cards',
    title: 'Gift Cards',
    description: 'Popular brands, retailers, and digital credit.',
    category: 'gift-card' as const,
    ids: ['rwd_amazon', 'rwd_walmart', 'rwd_starbucks', 'rwd_netflix', 'rwd_apple', 'rwd_google'],
    comingSoonSlots: 0,
  },
  {
    id: 'charity',
    title: 'Charity',
    description: 'Donate to meaningful causes.',
    category: 'charity' as const,
    ids: ['rwd_redcross', 'rwd_unicef', 'rwd_wwf'],
    comingSoonSlots: 0,
  },
] as const

export const popularRewardIds = ['rwd_paypal', 'rwd_walmart', 'rwd_apple'] as const

export const rewardBenefits = [
  {
    title: 'Fast Processing',
    copy: 'PayPal cash is typically the fastest after approval. Gift cards and digital codes usually arrive within 24 hours. Most requests are processed as soon as they are reviewed.',
    icon: 'zap',
  },
  {
    title: 'Secure Payouts',
    copy: 'Redemptions use encrypted, token-ready account access. Your personal information stays protected with industry-standard security practices.',
    icon: 'shield',
  },
  {
    title: 'Global Availability',
    copy: 'Choose from cash, regional gift cards, digital credit, and charity options as they are enabled for your account. Availability is controlled by configuration.',
    icon: 'globe',
  },
] as const

export const rewardsFaqs = [
  {
    q: 'What is the points to dollar conversion rate?',
    a: 'There is no single rate for every reward. Each catalog item publishes its own points requirement. Gift cards and promotions may offer different value than cash.',
  },
  {
    q: 'How long do payouts take?',
    a: 'PayPal cash is typically the fastest after approval. Gift cards and digital codes usually arrive within 24 hours. Physical or charity requests can take longer.',
  },
  {
    q: 'What’s the minimum redemption amount?',
    a: 'Minimums are set per reward. Many options start around the typical minimum shown on this page. Always check the card you want to redeem.',
  },
]

export const rewardsCta = {
  titleLead: 'Start Earning Points and',
  titleAccent: 'Unlock These Rewards',
  description:
    'Join the consumer panel, complete assigned studies, and redeem when you are ready. Your opinion has value — turn it into rewards today.',
  primary: 'Join for Free',
  secondary: 'Learn More',
}

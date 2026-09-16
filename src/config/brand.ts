export const joinIncentive = {
  label: '$25 Welcome Bonus',
  headline: 'Join the Consumer Panel',
  body: 'Share your opinions. Participate in research. Earn rewards.',
  disclaimer:
    'Reward amounts and typical ranges come from configuration and may change. They are not a guaranteed monthly earning.',
}

export const joinHighlights = [
  { value: '$50–150', label: 'Typical monthly range', hint: 'Varies by study volume' },
  { value: '5–8', label: 'Surveys per week', hint: 'When studies are available' },
  { value: 'Instant', label: 'Cashout available', hint: 'After approval' },
] as const

export const joinBenefits = [
  {
    title: '$50–150/month',
    copy: 'Earn rewards for sharing your shopping opinions, based on studies you complete.',
  },
  {
    title: 'Global brands',
    copy: 'Share opinions on products and services from research partners worldwide.',
  },
  {
    title: 'Privacy protected',
    copy: 'Your personal information is used to match studies and stays confidential.',
  },
] as const

export const joinTopics = [
  'Product testing & reviews',
  'Brand awareness',
  'Ad effectiveness',
  'Shopping preferences',
  'New product concepts',
  'Mobile app feedback',
] as const

export const joinBonuses = [
  '$25 Welcome Bonus after first 3 surveys',
  '$10 Referral Bonus for each friend who joins',
  'Monthly loyalty bonuses up to $50',
  'Special product testing opportunities',
] as const

export const joinTrust = [
  'Secure registration',
  'Privacy protected',
  'Research opportunities',
  'Rewards for participation',
] as const

export const publicNav = [
  { to: '/', label: 'Home', end: true },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/rewards', label: 'Rewards' },
  { to: '/help', label: 'Help' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
] as const

export const memberNav = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/surveys', label: 'Surveys' },
  { to: '/', label: 'Home', end: true },
  { to: '/rewards', label: 'Rewards' },
  { to: '/history', label: 'History' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
] as const

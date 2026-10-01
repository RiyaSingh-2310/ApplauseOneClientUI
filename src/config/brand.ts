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

export const joinHero = {
  /** Rendered uppercase via CSS. */
  eyebrow: 'Applause One Research Community',
  title: 'Join Applause One',
  body: 'Share your opinions, experiences, and expertise through research studies and receive rewards for eligible participation.',
  highlights: [
    { title: 'Relevant Studies', copy: 'Matched to your profile' },
    { title: 'Flexible Participation', copy: 'Take part when it suits you' },
    { title: 'Earn Rewards', copy: 'For eligible completed studies' },
  ],
  disclaimer:
    'Survey availability and reward amounts vary based on your profile, eligibility, and individual study requirements.',
} as const

export const joinWhyJoin = [
  { title: 'Earn Rewards', copy: 'Receive rewards for completing eligible surveys and research activities.' },
  {
    title: 'Relevant Research Opportunities',
    copy: 'Share your opinions, experiences, and expertise in studies from leading organizations and research partners.',
  },
  {
    title: 'Privacy Protected',
    copy: 'Your information is kept secure and used to match you with relevant research opportunities.',
  },
] as const

export const joinResearchOpportunities = [
  'Product & service feedback',
  'Brand & advertising studies',
  'Business & workplace research',
  'Technology & digital experiences',
  'Healthcare research',
  'Lifestyle & consumer studies',
] as const

export const joinMemberTrust = [
  { title: 'Secure & Confidential', copy: 'Your personal information is protected and handled with care.' },
  { title: 'Relevant Opportunities', copy: 'We match research invitations to your profile and experience.' },
  { title: 'Fair Rewards', copy: 'Receive rewards for eligible research activities you successfully complete.' },
  { title: 'Voluntary Participation', copy: 'You choose which research opportunities you want to take part in.' },
] as const

export const joinSidebarDisclaimer =
  'Survey availability and reward amounts vary based on eligibility and study requirements.'

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
  { to: '/', label: 'Home', end: true },
  { to: '/rewards', label: 'Rewards' },
  { to: '/redeem-rewards', label: 'Redeem Rewards' },
  { to: '/history', label: 'Reward History' },
  { to: '/contact', label: 'Contact' },
] as const

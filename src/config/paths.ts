export const paths = {
  home: '/',
  howItWorks: '/how-it-works',
  rewards: '/rewards',
  help: '/help',
  about: '/about',
  contact: '/contact',
  join: '/join',
  login: '/login',
  dashboard: '/dashboard',
  history: '/history',
  settings: '/settings',
  surveys: '/surveys',
} as const

export const legacyPanelistRedirects: Record<string, string> = {
  '/panelist': paths.dashboard,
  '/panelist/dashboard': paths.dashboard,
  '/panelist/rewards': paths.rewards,
  '/panelist/reward-requests': paths.history,
  '/panelist/reward-history': paths.history,
  '/panelist/profile': paths.settings,
  '/panelist/projects': paths.dashboard,
}

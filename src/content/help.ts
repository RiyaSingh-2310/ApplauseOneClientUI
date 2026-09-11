export const helpHero = {
  titleLead: 'How Can We',
  titleAccent: 'Help You?',
  description:
    'Find answers to your questions, get support, and learn how to make the most of your survey rewards experience.',
  searchPlaceholder: 'Search for help articles, FAQs, or topics...',
}

export const helpStats = [
  { value: '150+', label: 'Help articles', hint: 'Comprehensive guides and tutorials' },
  { value: '24/7', label: 'Support available', hint: 'Get help whenever you need it' },
  { value: '95%', label: 'Issue resolution rate', hint: 'We solve problems quickly' },
] as const

export const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'smartphone',
    articles: [
      {
        title: 'How to create an account',
        copy: 'Step-by-step guide to join our community',
        icon: 'user',
      },
      {
        title: 'Completing your first survey',
        copy: 'Everything you need to know about surveys',
        icon: 'clipboard',
      },
      {
        title: 'Understanding your dashboard',
        copy: 'Navigate your member area with ease',
        icon: 'layout',
      },
      {
        title: 'Profile setup and verification',
        copy: 'Optimize your profile for more opportunities',
        icon: 'badge',
      },
    ],
  },
  {
    id: 'surveys',
    title: 'Surveys & Earning',
    icon: 'trending',
    articles: [
      {
        title: 'How to find available surveys',
        copy: 'Discover earning opportunities',
        icon: 'search',
      },
      {
        title: 'Survey completion tips',
        copy: 'Maximize your success rate',
        icon: 'zap',
      },
      {
        title: 'Points system explained',
        copy: 'Understanding how points work',
        icon: 'chart',
      },
      {
        title: 'Why was I disqualified?',
        copy: 'Common reasons and how to avoid them',
        icon: 'clock',
      },
    ],
  },
  {
    id: 'rewards',
    title: 'Rewards & Redemption',
    icon: 'gem',
    articles: [
      {
        title: 'How to redeem your points',
        copy: 'Turn your earnings into rewards',
        icon: 'gift',
      },
      {
        title: 'Available reward options',
        copy: 'Explore gift cards, PayPal, and more',
        icon: 'wallet',
      },
      {
        title: 'Delivery times and methods',
        copy: 'When and how you’ll receive rewards',
        icon: 'truck',
      },
      {
        title: 'Reward troubleshooting',
        copy: 'Common issues and solutions',
        icon: 'wrench',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & Security',
    icon: 'settings',
    articles: [
      {
        title: 'Account security best practices',
        copy: 'Keep your account safe',
        icon: 'shield',
      },
      {
        title: 'Updating personal information',
        copy: 'How to change your details',
        icon: 'pencil',
      },
      {
        title: 'Password reset and recovery',
        copy: 'Regain access to your account',
        icon: 'key',
      },
      {
        title: 'Account verification process',
        copy: 'Complete your verification',
        icon: 'users',
      },
    ],
  },
] as const

export const helpTutorial = {
  title: 'Video Tutorials',
  copy: 'Watch step-by-step video guides for common tasks and features.',
  cta: 'Watch Videos',
  url: null as string | null,
}

export const helpResources = [
  {
    id: 'forum',
    title: 'Community Forum',
    copy: 'Connect with other members and share experiences and tips.',
    cta: 'Join Forum',
    icon: 'users',
  },
  {
    id: 'status',
    title: 'System Status',
    copy: 'Check if there are any ongoing issues or maintenance updates.',
    cta: 'Check Status',
    icon: 'alert',
  },
  {
    id: 'ideas',
    title: 'Feature Requests',
    copy: 'Suggest new features or improvements to make our platform better.',
    cta: 'Submit Idea',
    icon: 'check',
  },
] as const

export const helpFaqs = [
  {
    q: 'How long does it take to receive my rewards?',
    a: 'Reward processing times can vary. E-gift cards are typically delivered within 24–48 hours, while PayPal payments may take 3–5 business days.',
  },
  {
    q: 'Why was I disqualified from a survey?',
    a: 'Studies often have screening criteria or quotas. A disqualification usually means the study is not a fit or is already full. Keep your profile current and answer screening questions carefully.',
  },
  {
    q: 'How can I earn more points?',
    a: 'Complete assigned studies in your portal, finish in-progress projects before they expire, and keep shopping interests up to date so matching stays accurate. Point values are set per study.',
  },
  {
    q: 'What’s the minimum amount I can redeem?',
    a: 'Minimums are set per reward option in the catalog. Check the points required on the specific cash, gift card, or charity option you want to redeem.',
  },
  {
    q: 'Do my points expire?',
    a: 'Points remain on your member account so you can redeem when you meet a specific reward’s requirement. Individual promotions may include their own timelines.',
  },
  {
    q: 'Can I change my reward after redemption?',
    a: 'Once a request is submitted it becomes pending for review. If it has not been approved yet, contact support with the reward name and we will help from there.',
  },
]

export const howItWorksHero = {
  eyebrow: 'Simple Process',
  titleLead: 'How It',
  titleAccent: 'Works',
  description:
    'Getting started with Applause One is simple. Follow these four easy steps to start earning rewards for your opinions.',
}

export const howItWorksSteps = [
  {
    n: '01',
    title: 'Sign Up',
    copy: 'Create your free consumer panel account in a few minutes. Join Now always opens registration — never login. No fees and no commitments.',
    bullets: ['Quick registration process', 'Email verification', 'Profile setup'],
    icon: 'userPlus',
  },
  {
    n: '02',
    title: 'Complete Your Profile',
    copy: 'Share demographics, shopping habits, and survey preferences so we can match you with relevant consumer studies.',
    bullets: ['Personal and household details', 'Shopping & lifestyle interests', 'Survey time preferences'],
    icon: 'clipboard',
  },
  {
    n: '03',
    title: 'Participate in Research',
    copy: 'When a study is a fit, it appears in your portal with the newest assignment first. Open it from Assigned Projects and complete it on the device you prefer.',
    bullets: ['5–15 minute surveys', 'Mobile-friendly', 'Assigned by profile match'],
    icon: 'search',
  },
  {
    n: '04',
    title: 'Earn Rewards',
    copy: 'Completed studies credit points to your balance. Redeem for cash, gift cards, digital credit, or charity when you meet that option’s requirement.',
    bullets: ['Points credited per study', 'PayPal and gift card options', 'Track requests in your portal'],
    icon: 'gift',
  },
] as const

export const researchCategories = {
  eyebrow: 'Research Categories',
  titleLead: 'Choose Your Research',
  titleAccent: 'Category',
  description:
    'Select the category that matches your background to receive the most relevant surveys and maximize your opportunities.',
  consumer: {
    badge: 'Consumer Research',
    title: 'General Consumer Surveys',
    copy: 'Share your opinions about everyday products, services, and experiences as a regular consumer.',
    topicsLabel: 'Survey Topics',
    topics: 'Retail, Food & Dining, Entertainment, Travel, Technology',
    timeLabel: 'Time & Frequency',
    time: '5–15 mins · 5–8 surveys/week',
    range: '$10–30',
    rangeHint: 'typical monthly range',
    cta: 'Join Consumer Panel',
  },
  professional: {
    badge: 'Business Professional Research',
    title: 'B2B Professional Surveys',
    copy: 'Share business insights on workplace tools, services, and trends from your professional experience.',
    topicsLabel: 'Survey Topics',
    topics: 'Workplace software, B2B services, Industry trends, Professional tools',
    timeLabel: 'Time & Frequency',
    time: '10–20 mins · 3–6 surveys/week',
    range: '$5–12',
    rangeHint: 'typical per survey',
    cta: 'Join Professional Panel',
  },
  healthcareEyebrow: 'Healthcare Research',
  healthcare: [
    {
      title: 'Patients & Caregivers',
      copy: 'Share your healthcare experiences to help improve medical services and treatments.',
      topicsLabel: 'Topics',
      topics: 'Treatment experiences, Medical devices, Health services, Patient care',
      duration: '8–15 mins',
      frequency: '4–7/week',
      range: '$125–250',
      rangeHint: 'typical monthly range',
      cta: 'Join Patient Panel',
    },
    {
      title: 'Healthcare Professionals',
      copy: 'Medical experts providing insights on healthcare technology, pharmaceuticals, and medical devices.',
      topicsLabel: 'Topics',
      topics: 'Medical devices, Pharmaceuticals, Healthcare technology, Clinical practices',
      duration: '10–25 mins',
      frequency: '2–5/week',
      range: '$200–400',
      rangeHint: 'typical monthly range',
      cta: 'Join Professional Panel',
    },
  ],
  multi: {
    title: 'Join Multiple Categories',
    copy: 'Maximize your earning potential by participating in multiple research categories. A healthcare professional can also join consumer surveys, and business professionals can share personal shopping insights.',
    chips: ['+150% More Opportunities', 'Higher Monthly Earnings', 'Better Survey Matching'],
    cta: 'Start Your Research Journey',
  },
} as const

export const whyChooseHowItWorks = {
  title: 'Why Choose Applause One?',
  description: 'We’re committed to providing the best survey experience with fair compensation and respect for your time.',
  items: [
    {
      title: 'Flexible Schedule',
      copy: 'Complete surveys whenever you want, wherever you are.',
      icon: 'clock',
    },
    {
      title: 'Data Security',
      copy: 'Your personal information is protected with enterprise-grade security.',
      icon: 'shield',
    },
    {
      title: 'Quality Surveys',
      copy: 'We partner with top brands to bring you relevant, interesting surveys.',
      icon: 'sparkles',
    },
  ],
} as const

export const howItWorksFaqs = [
  {
    q: 'How much can I earn?',
    a: 'Earnings depend on the studies assigned to you and the time you spend. Typical ranges shown on this page come from configuration and can change. Reward values are defined per option, not by one universal rate.',
  },
  {
    q: 'When do I get paid?',
    a: 'After you submit a redemption request, status moves from pending to approved or completed. PayPal is typically fastest. Gift cards usually arrive within 24 hours after approval.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes. There is no signup fee and no membership charge. Applause One works with research partners and never charges panelists to participate.',
  },
  {
    q: 'What type of surveys will I see?',
    a: 'Consumer product testing, brand awareness, shopping preferences, app feedback, healthcare, and new concept reviews are common. Assignments are matched to your profile.',
  },
]

export const howItWorksCta = {
  title: 'Ready to Start Earning?',
  description:
    'Join people who trust Applause One to share their opinions and earn real rewards. It’s completely free to get started.',
  primary: 'Join Now — It’s Free',
  secondary: 'Learn More',
}

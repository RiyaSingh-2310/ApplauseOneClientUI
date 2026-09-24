export const contactHero = {
  eyebrow: 'Contact Support',
  titleLead: 'Get in Touch',
  titleAccent: 'We’re Here to Help',
  description:
    'Have a question, need support, or want to share feedback? Our friendly team is ready to help you succeed.',
}

export const contactMethods = [
  {
    id: 'email',
    title: 'Email Support',
    copy: 'Get help via email within 24 hours',
    detail: 'info@applauseone.com',
    cta: 'Send Email',
    href: 'mailto:info@applauseone.com',
    icon: 'mail',
  },
  {
    id: 'chat',
    title: 'Live Chat',
    copy: 'Chat with our support team instantly',
    detail: 'Available 24/7',
    cta: 'Start Chat',
    href: null as string | null,
    icon: 'chat',
  },
  {
    id: 'help',
    title: 'Help Center',
    copy: 'Browse guides, FAQs, and answers',
    detail: 'Articles and tutorials',
    cta: 'Browse Help',
    href: '/help',
    icon: 'help',
  },
  {
    id: 'office',
    title: 'Office Location',
    copy: 'Visit our headquarters',
    detail: 'Level 35-02 (East Wing), Q Sentral\n2A, Jalan Stesen Sentral 2\nKL Sentral, Kuala Lumpur 50470\nMalaysia',
    cta: 'Get Directions',
    href: 'https://www.google.com/maps/search/?api=1&query=Level%2035-02%20East%20Wing%20Q%20Sentral%202A%20Jalan%20Stesen%20Sentral%202%20KL%20Sentral%20Kuala%20Lumpur%2050470%20Malaysia',
    icon: 'map',
  },
] as const

export const supportHours = [
  { days: 'Monday – Friday', hours: '9:00 AM – 8:00 PM EST' },
  { days: 'Saturday', hours: '10:00 AM – 6:00 PM EST' },
  { days: 'Sunday', hours: '12:00 AM – 5:00 PM EST' },
] as const

export const quickHelpTopics = [
  {
    title: 'Account Issues',
    copy: 'Login problems, password reset, account verification',
    icon: 'user',
  },
  {
    title: 'Payment & Rewards',
    copy: 'Missing points, redemption issues, payment questions',
    icon: 'gift',
  },
  {
    title: 'Technical Support',
    copy: 'App bugs, website errors, browser compatibility',
    icon: 'monitor',
  },
] as const

export const whyContactUs = [
  '24 hour response guarantee',
  'Friendly, knowledgeable support team',
  'Multiple contact options available',
  'Trusted by 100K+ members worldwide',
] as const

export const contactFaqs = [
  {
    q: 'How quickly will I get a response?',
    a: 'We aim to respond to all inquiries within 24 hours, often much sooner. Live chat gets immediate responses during business hours.',
  },
  {
    q: 'Can I call for urgent issues?',
    a: 'Yes! Our phone support is available during business hours for urgent account or payment issues.',
  },
  {
    q: 'What information should I include?',
    a: 'Include your email address, a clear description of the issue, and any relevant screenshots or error messages.',
  },
  {
    q: 'Do you offer support in other languages?',
    a: 'Currently, we provide support in English, Spanish, and French. We’re expanding to more languages soon.',
  },
]

export const phoneSupportMethod = {
  id: 'phone',
  title: 'Phone Support',
  copy: 'Speak directly with our team',
  detail: '+60 3 2731 9315',
  cta: 'Call Now',
  href: 'tel:+60327319315',
  icon: 'phone',
} as const

export const helpContactIntro = {
  title: 'Contact Our Support Team',
  description: 'Choose your preferred way to get in touch with us. We’re here to help!',
  liveChatCopy: 'Get instant help from our support team.',
  liveChatMeta: '24/7 available',
  emailCopy: 'Send us a detailed message.',
  emailMeta: 'Response within 24 hours',
  phoneCopy: 'Speak directly with our team.',
  phoneMeta: 'Mon–Fri, 9AM–6PM EST',
}

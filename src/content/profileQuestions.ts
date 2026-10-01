export type ProfileSectionId = 'demographics' | 'professional' | 'lifestyle' | 'preferences'

export type ProfileFieldType = 'dropdown' | 'radio' | 'checkbox' | 'text'

export interface ProfileOptionSpec {
  value: string
  label: string
  /** Backend option names that mean the same thing (matched case/punctuation-insensitively). */
  aliases?: string[]
  /** Selecting this option clears the others in a multi-select (and vice versa). */
  exclusive?: boolean
}

export interface ProfileFieldSpec {
  key: string
  section: ProfileSectionId
  /** Backend `questioner.dropdown_category` that stores this answer. */
  category: string
  label?: string
  hint?: string
  fieldType?: ProfileFieldType
  required?: boolean
  options?: ProfileOptionSpec[]
  placeholder?: string
  maxLength?: number
  /**
   * `override` only restyles an API question when it exists.
   * `standalone` is always rendered, and is bound to the API question once it exists.
   * `hidden` removes an API question from the form.
   */
  mode: 'override' | 'standalone' | 'hidden'
}

/** Backend step numbers (`questioner.step_no`) that map to registration sections. */
export const API_STEP_SECTIONS: Record<number, ProfileSectionId> = {
  2: 'demographics',
  3: 'lifestyle',
  4: 'preferences',
}

export const PROFESSIONAL_EMPLOYMENT_VALUES = [
  'employed-full-time',
  'employed-part-time',
  'self-employed',
  'business-owner',
  'freelancer',
] as const

export const profileFieldSpecs: ProfileFieldSpec[] = [
  {
    key: 'householdIncome',
    section: 'demographics',
    category: 'IncomeRange',
    label: 'What is your annual household income?',
    mode: 'override',
  },
  {
    key: 'householdSize',
    section: 'demographics',
    category: 'HouseholdSize',
    label: 'How many people currently live in your household, including you?',
    mode: 'override',
  },
  {
    key: 'education',
    section: 'demographics',
    category: 'EducationLevel',
    label: 'What is the highest level of education you have completed?',
    mode: 'override',
  },
  {
    key: 'employmentStatus',
    section: 'demographics',
    category: 'EmploymentStatus',
    label: 'What is your current employment status?',
    fieldType: 'dropdown',
    required: true,
    mode: 'standalone',
    options: [
      { value: 'employed-full-time', label: 'Employed full-time', aliases: ['Full-time employed'] },
      { value: 'employed-part-time', label: 'Employed part-time', aliases: ['Part-time employed'] },
      { value: 'self-employed', label: 'Self-employed' },
      { value: 'business-owner', label: 'Business owner' },
      { value: 'freelancer', label: 'Freelancer / Independent professional' },
      { value: 'student', label: 'Student' },
      { value: 'homemaker', label: 'Homemaker' },
      { value: 'retired', label: 'Retired' },
      { value: 'unemployed-looking', label: 'Unemployed and looking for work' },
      { value: 'unemployed-not-looking', label: 'Unemployed and not currently looking for work' },
      { value: 'other', label: 'Other' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' },
    ],
  },

  {
    key: 'jobTitle',
    section: 'professional',
    category: 'JobTitle',
    label: 'Job title',
    fieldType: 'text',
    required: true,
    placeholder: 'e.g. Marketing Manager',
    maxLength: 100,
    mode: 'standalone',
  },
  {
    key: 'jobFunction',
    section: 'professional',
    category: 'JobFunction',
    label: 'Department / Function',
    fieldType: 'dropdown',
    required: true,
    mode: 'standalone',
    options: [
      { value: 'executive-management', label: 'Executive / General management' },
      { value: 'finance', label: 'Finance & Accounting' },
      { value: 'hr', label: 'Human Resources' },
      { value: 'it', label: 'Information Technology' },
      { value: 'engineering', label: 'Engineering / R&D' },
      { value: 'product', label: 'Product Management' },
      { value: 'marketing', label: 'Marketing & Communications' },
      { value: 'sales', label: 'Sales & Business Development' },
      { value: 'operations', label: 'Operations' },
      { value: 'procurement', label: 'Procurement / Purchasing' },
      { value: 'customer-service', label: 'Customer Service / Support' },
      { value: 'legal', label: 'Legal & Compliance' },
      { value: 'administration', label: 'Administration' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'jobLevel',
    section: 'professional',
    category: 'JobLevel',
    label: 'Job level / Seniority',
    fieldType: 'dropdown',
    required: true,
    mode: 'standalone',
    options: [
      { value: 'c-level', label: 'C-level executive (CEO, CFO, CTO, etc.)' },
      { value: 'owner', label: 'Owner / Founder / Partner' },
      { value: 'vp', label: 'President / Vice President' },
      { value: 'director', label: 'Director' },
      { value: 'manager', label: 'Manager' },
      { value: 'supervisor', label: 'Team lead / Supervisor' },
      { value: 'individual', label: 'Individual contributor / Professional' },
      { value: 'entry', label: 'Entry level' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'industry',
    section: 'professional',
    category: 'Industry',
    label: 'Industry',
    fieldType: 'dropdown',
    required: true,
    mode: 'standalone',
    options: [
      { value: 'advertising', label: 'Advertising & Marketing' },
      { value: 'agriculture', label: 'Agriculture' },
      { value: 'automotive', label: 'Automotive' },
      { value: 'banking', label: 'Banking & Financial Services' },
      { value: 'construction', label: 'Construction & Real Estate' },
      { value: 'consulting', label: 'Consulting & Professional Services' },
      { value: 'education', label: 'Education' },
      { value: 'energy', label: 'Energy & Utilities' },
      { value: 'government', label: 'Government & Public Sector' },
      { value: 'healthcare', label: 'Healthcare & Pharmaceuticals' },
      { value: 'hospitality', label: 'Hospitality & Travel' },
      { value: 'it-software', label: 'Information Technology & Software' },
      { value: 'insurance', label: 'Insurance' },
      { value: 'legal', label: 'Legal' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'media', label: 'Media & Entertainment' },
      { value: 'non-profit', label: 'Non-profit' },
      { value: 'retail', label: 'Retail & E-commerce' },
      { value: 'telecom', label: 'Telecommunications' },
      { value: 'transportation', label: 'Transportation & Logistics' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'companySize',
    section: 'professional',
    category: 'CompanySize',
    label: 'Company size',
    fieldType: 'dropdown',
    required: true,
    mode: 'standalone',
    options: [
      { value: '1', label: '1 employee (just me)' },
      { value: '2-9', label: '2-9 employees' },
      { value: '10-49', label: '10-49 employees' },
      { value: '50-249', label: '50-249 employees' },
      { value: '250-999', label: '250-999 employees' },
      { value: '1000-4999', label: '1,000-4,999 employees' },
      { value: '5000+', label: '5,000 or more employees' },
    ],
  },
  {
    key: 'companyRevenue',
    section: 'professional',
    category: 'CompanyRevenue',
    label: 'Company annual revenue',
    fieldType: 'dropdown',
    required: true,
    mode: 'standalone',
    options: [
      { value: 'under-1m', label: 'Under $1 million' },
      { value: '1m-10m', label: '$1 million - $10 million' },
      { value: '10m-50m', label: '$10 million - $50 million' },
      { value: '50m-100m', label: '$50 million - $100 million' },
      { value: '100m-500m', label: '$100 million - $500 million' },
      { value: '500m-1b', label: '$500 million - $1 billion' },
      { value: 'over-1b', label: 'Over $1 billion' },
      { value: 'unknown', label: "Don't know / Prefer not to say" },
    ],
  },
  {
    key: 'purchasingRole',
    section: 'professional',
    category: 'PurchasingRole',
    label: 'Purchasing / decision-making responsibility',
    fieldType: 'dropdown',
    required: true,
    mode: 'standalone',
    options: [
      { value: 'final-decision', label: 'I make the final purchasing decision' },
      { value: 'influence', label: 'I significantly influence purchasing decisions' },
      { value: 'evaluate', label: 'I evaluate or recommend products and services' },
      { value: 'none', label: 'I am not involved in purchasing decisions' },
    ],
  },
  {
    key: 'purchaseInfluence',
    section: 'professional',
    category: 'PurchaseInfluence',
    label: 'Products or services you influence or purchase',
    hint: 'Select all that apply',
    fieldType: 'checkbox',
    required: true,
    mode: 'standalone',
    options: [
      { value: 'it-hardware', label: 'IT hardware & devices' },
      { value: 'software', label: 'Software & cloud services' },
      { value: 'telecom', label: 'Telecom & networking' },
      { value: 'marketing', label: 'Marketing & advertising services' },
      { value: 'office', label: 'Office supplies & equipment' },
      { value: 'professional-services', label: 'Professional services (legal, consulting, accounting)' },
      { value: 'hr', label: 'HR, recruiting & employee benefits' },
      { value: 'finance', label: 'Financial services & insurance' },
      { value: 'facilities', label: 'Facilities & maintenance' },
      { value: 'logistics', label: 'Logistics & transportation' },
      { value: 'manufacturing', label: 'Manufacturing equipment & materials' },
      { value: 'travel', label: 'Business travel & events' },
      { value: 'none', label: 'None of these', exclusive: true },
    ],
  },

  {
    key: 'shoppingMethod',
    section: 'lifestyle',
    category: 'ShoppingMethod',
    mode: 'override',
    options: [
      { value: 'online', label: 'Mostly online', aliases: ['Primarily Online'] },
      { value: 'in-store', label: 'Mostly in-store', aliases: ['Primarily In-Store'] },
      { value: 'both', label: 'About equally online and in-store', aliases: ['Both Equally'] },
      { value: 'depends', label: 'Depends on the product', aliases: ['Varies by Product'] },
    ],
  },
  {
    key: 'shoppingBudget',
    section: 'lifestyle',
    category: 'ShoppingBudget',
    mode: 'hidden',
  },
  {
    key: 'surveyDevice',
    section: 'lifestyle',
    category: 'DeviceType',
    label: 'Which device do you usually use to complete online surveys?',
    mode: 'override',
    options: [
      { value: 'smartphone', label: 'Smartphone' },
      { value: 'desktop-laptop', label: 'Desktop / Laptop' },
      { value: 'tablet', label: 'Tablet' },
      { value: 'varies', label: 'No preference / Varies' },
    ],
  },
  {
    key: 'shoppingCategories',
    section: 'lifestyle',
    category: 'ShoppingCategory',
    hint: 'Select all that apply',
    mode: 'override',
    options: [
      { value: 'fashion', label: 'Fashion & Apparel' },
      { value: 'beauty', label: 'Beauty & Personal Care' },
      { value: 'food', label: 'Food & Beverages' },
      { value: 'grocery', label: 'Grocery & Household Products' },
      { value: 'home', label: 'Home & Garden' },
      { value: 'technology', label: 'Technology & Electronics' },
      { value: 'entertainment', label: 'Entertainment & Media' },
      { value: 'travel', label: 'Travel & Leisure' },
      { value: 'automotive', label: 'Automotive' },
      { value: 'banking', label: 'Banking & Financial Services' },
      { value: 'telecom', label: 'Telecom & Mobile Services' },
      { value: 'health', label: 'Health & Wellness' },
      { value: 'sports', label: 'Sports & Fitness' },
      { value: 'parenting', label: 'Parenting & Family' },
      { value: 'restaurants', label: 'Restaurants & Food Delivery' },
      { value: 'ecommerce', label: 'Online Shopping / E-commerce' },
    ],
  },

  {
    key: 'surveyTopics',
    section: 'preferences',
    category: 'SurveyTopic',
    label: 'Which survey topics interest you?',
    mode: 'override',
    options: [
      { value: 'consumer-products', label: 'Consumer products' },
      { value: 'technology', label: 'Technology' },
      { value: 'food', label: 'Food & beverage' },
      { value: 'travel', label: 'Travel & hospitality', aliases: ['Travel'] },
      { value: 'banking', label: 'Banking & financial services', aliases: ['Finance'] },
      { value: 'entertainment', label: 'Entertainment & media', aliases: ['Entertainment'] },
      { value: 'automotive', label: 'Automotive' },
      { value: 'retail', label: 'Retail & shopping' },
      { value: 'business', label: 'Business & workplace' },
      { value: 'advertising', label: 'Advertising & brands' },
      { value: 'health', label: 'Health & wellness' },
      { value: 'telecom', label: 'Telecom & mobile services' },
    ],
  },
  {
    key: 'surveyTime',
    section: 'preferences',
    category: 'SurveyTime',
    label: 'When do you usually prefer to take surveys?',
    mode: 'override',
    options: [
      { value: 'morning', label: 'Morning', aliases: ['Morning (6AM - 12PM)'] },
      { value: 'afternoon', label: 'Afternoon', aliases: ['Afternoon (12PM - 6PM)'] },
      { value: 'evening', label: 'Evening', aliases: ['Evening (6PM - 10PM)'] },
      { value: 'late-evening', label: 'Late evening', aliases: ['Night (10PM - 12AM)'] },
      { value: 'no-preference', label: 'No preference', aliases: ['Anytime'] },
    ],
  },
  {
    key: 'surveyFrequency',
    section: 'preferences',
    category: 'SurveyFrequency',
    label: 'How often would you like to receive survey invitations?',
    mode: 'override',
    options: [
      { value: 'whenever-available', label: 'Whenever a suitable study is available' },
      { value: 'few-times-week', label: 'A few times a week' },
      { value: 'weekly', label: 'About once a week', aliases: ['Weekly'] },
      { value: 'few-times-month', label: 'A few times a month' },
    ],
  },
  {
    key: 'motivation',
    section: 'preferences',
    category: 'Motivation',
    label: 'What motivates you to participate in research?',
    mode: 'override',
    options: [
      { value: 'rewards', label: 'Earning rewards', aliases: ['Extra income'] },
      { value: 'opinions', label: 'Sharing my opinions', aliases: ['Sharing my opinion'] },
      { value: 'improve', label: 'Helping improve products and services', aliases: ['Influencing brands/products'] },
      { value: 'new-products', label: 'Trying or learning about new products', aliases: ['Trying new products'] },
      { value: 'research', label: 'Contributing to research' },
      { value: 'professional', label: 'Sharing my professional experience' },
      { value: 'fun', label: 'Just for fun' },
    ],
  },
  {
    key: 'researchActivities',
    section: 'preferences',
    category: 'ResearchActivity',
    label: 'What types of research would you be interested in participating in?',
    hint: 'Select all that apply:',
    fieldType: 'checkbox',
    required: false,
    mode: 'standalone',
    options: [
      { value: 'online-surveys', label: 'Online surveys' },
      { value: 'online-interviews', label: 'Online interviews' },
      { value: 'focus-groups', label: 'Focus groups' },
      { value: 'product-testing', label: 'Product testing' },
      { value: 'website-app-testing', label: 'Website / app testing' },
      { value: 'communities', label: 'Research communities' },
      { value: 'other', label: 'Other research activities' },
    ],
  },
]

/** Account-step fields stored as onboarding text answers once the backend defines them. */
export const accountAnswerCategories = {
  country: 'CountryOfResidence',
  dateOfBirth: 'DateOfBirth',
} as const

export type ConsentField =
  | 'emailInvitations'
  | 'opportunityUpdates'
  | 'memberUpdates'
  | 'acceptTerms'
  | 'researchInvitations'
  | 'acceptPrivacy'
  | 'newsConsent'

/**
 * Consent checkboxes are stored as Yes/No answers on Privacy-step questions.
 * Existing questions are matched by id/text; new ones by the exact question text.
 */
export const consentBindings: Array<{ field: ConsentField; ids?: number[]; texts: string[] }> = [
  { field: 'acceptPrivacy', ids: [10], texts: ['Do you consent to data sharing?'] },
  { field: 'emailInvitations', ids: [11], texts: ['Opt in to marketing emails?'] },
  { field: 'acceptTerms', ids: [12], texts: ['Do you accept the terms?'] },
  { field: 'opportunityUpdates', texts: ['Send me updates about new research opportunities'] },
  { field: 'memberUpdates', texts: ['Send me member news, rewards, and special opportunities'] },
  { field: 'researchInvitations', texts: ['I agree to receive invitations to research studies that may match my profile.'] },
  { field: 'newsConsent', texts: ['I would like to receive Applause One news, member updates, and special opportunities'] },
]

export const profileSectionCopy: Record<ProfileSectionId, { title: string; heading: string; copy: string }> = {
  demographics: {
    title: 'Demographics',
    heading: 'Demographics',
    copy: 'Help us match you with relevant consumer and professional research opportunities.',
  },
  professional: {
    title: 'Professional',
    heading: 'Professional Profile',
    copy: 'Tell us about your work so we can match you with relevant professional research.',
  },
  lifestyle: {
    title: 'Lifestyle',
    heading: 'Lifestyle & Shopping',
    copy: 'Tell us about your lifestyle and shopping preferences to help us match you with relevant research studies.',
  },
  preferences: {
    title: 'Research',
    heading: 'Research Preferences',
    copy: 'Tell us what types of research you’re interested in and how you prefer to participate.',
  },
}

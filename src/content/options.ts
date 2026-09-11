export const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']

export const genderOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]

export const incomeOptions = [
  { value: 'under-25k', label: 'Under $25k' },
  { value: '25k-50k', label: '$25k – $50k' },
  { value: '50k-75k', label: '$50k – $75k' },
  { value: '75k-100k', label: '$75k – $100k' },
  { value: '100k-150k', label: '$100k – $150k' },
  { value: 'over-150k', label: 'Over $150k' },
]

export const educationOptions = [
  { value: 'high-school', label: 'High School' },
  { value: 'some-college', label: 'Some College' },
  { value: 'associates', label: "Associate's Degree" },
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'doctorate', label: 'Doctorate' },
]

export const employmentOptions = [
  { value: 'full-time', label: 'Full-time employed' },
  { value: 'part-time', label: 'Part-time employed' },
  { value: 'self-employed', label: 'Self-employed' },
  { value: 'student', label: 'Student' },
  { value: 'retired', label: 'Retired' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'homemaker', label: 'Homemaker' },
]

export const householdSizeOptions = [
  { value: '1', label: '1 person' },
  { value: '2', label: '2 people' },
  { value: '3', label: '3 people' },
  { value: '4', label: '4 people' },
  { value: '5+', label: '5+ people' },
]

export const shoppingMethods = [
  { value: 'online', label: 'Primarily Online' },
  { value: 'in-store', label: 'Primarily In-Store' },
  { value: 'both', label: 'Both Equally' },
  { value: 'varies', label: 'Varies by Product' },
]

export const budgetOptions = [
  { value: 'under-200', label: 'Under $200' },
  { value: '200-500', label: '$200 – $500' },
  { value: '500-1000', label: '$500 – $1,000' },
  { value: '1000-2000', label: '$1,000 – $2,000' },
  { value: 'over-2000', label: 'Over $2,000' },
]

export const deviceOptions = [
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'desktop', label: 'Desktop Computer' },
]

export const interestOptions = [
  { value: 'technology', label: 'Technology & Electronics' },
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'travel', label: 'Travel & Leisure' },
  { value: 'beauty', label: 'Health & Beauty' },
  { value: 'auto', label: 'Automotive' },
  { value: 'entertainment', label: 'Entertainment & Media' },
  { value: 'fitness', label: 'Sports & Fitness' },
  { value: 'kids', label: 'Baby & Kids Products' },
  { value: 'pets', label: 'Pet Supplies' },
  { value: 'books', label: 'Books & Education' },
]

export const surveyTimeOptions = [
  { value: 'morning', label: 'Morning (6AM – 12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM – 6PM)' },
  { value: 'evening', label: 'Evening (6PM – 10PM)' },
  { value: 'night', label: 'Night (10PM – 12AM)' },
  { value: 'anytime', label: 'Anytime' },
]

export const surveyFrequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'few-times-week', label: 'A few times a week' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export function optionLabel(options: Array<{ value: string; label: string }>, value: string) {
  return options.find((option) => option.value === value)?.label ?? value
}

import type { RegisterPayload } from '@/types/auth'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const ZIP_PATTERN = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/
export const PHONE_PATTERN = /^[+]?[\d\s().-]{10,18}$/

export const registerSteps = [
  { id: 0, title: 'Personal', heading: 'Personal Information', copy: 'Your details and a secure password.' },
  { id: 1, title: 'Demographics', heading: 'Demographics', copy: 'Help us match relevant consumer studies.' },
  { id: 2, title: 'Lifestyle', heading: 'Shopping & Lifestyle', copy: 'Tell us how you shop and take surveys.' },
  { id: 3, title: 'Preferences', heading: 'Survey Preferences', copy: 'How you like to participate.' },
  { id: 4, title: 'Privacy', heading: 'Community & Privacy', copy: 'Communication choices and required consents.' },
  { id: 5, title: 'Complete', heading: 'Review & Submit', copy: 'Confirm your profile, then join the panel.' },
] as const

export const emptyRegisterForm: RegisterPayload = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: '',
  zipCode: '',
  ageRange: '',
  gender: '',
  householdIncome: '',
  educationLevel: '',
  employmentStatus: '',
  householdSize: '',
  shoppingMethod: '',
  monthlyBudget: '',
  primaryDevice: '',
  shoppingInterests: [],
  surveyTime: '',
  surveyFrequency: '',
  motivation: '',
  emailInvitations: true,
  opportunityUpdates: false,
  earningTips: false,
  acceptTerms: false,
  acceptPrivacy: false,
}

export function validateRegisterStep(form: RegisterPayload, step: number) {
  const errors: Record<string, string> = {}

  if (step === 0) {
    if (!form.firstName.trim()) errors.firstName = 'First name is required.'
    if (!form.lastName.trim()) errors.lastName = 'Last name is required.'
    if (!EMAIL_PATTERN.test(form.email)) errors.email = 'Enter a valid email address.'
    if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) {
      errors.phone = 'Enter a valid phone number, including area code.'
    }
    if (!ZIP_PATTERN.test(form.zipCode.trim())) errors.zipCode = 'Enter a valid ZIP or postal code.'
    if (form.password.length < 8) errors.password = 'Use at least 8 characters.'
    else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      errors.password = 'Include a letter and a number.'
    }
    if (!form.confirmPassword) errors.confirmPassword = 'Confirm your password.'
    else if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.'
  }

  if (step === 1) {
    if (!form.ageRange) errors.ageRange = 'Select an age range.'
    if (!form.gender) errors.gender = 'Select a gender option.'
    if (!form.householdIncome) errors.householdIncome = 'Select household income.'
    if (!form.householdSize) errors.householdSize = 'Select household size.'
    if (!form.educationLevel) errors.educationLevel = 'Select education level.'
    if (!form.employmentStatus) errors.employmentStatus = 'Select employment status.'
  }

  if (step === 2) {
    if (!form.shoppingMethod) errors.shoppingMethod = 'Select a shopping method.'
    if (form.shoppingInterests.length === 0) errors.shoppingInterests = 'Choose at least one interest.'
  }

  if (step === 4 || step === 5) {
    if (!form.acceptTerms) errors.acceptTerms = 'Please agree to the terms.'
    if (!form.acceptPrivacy) errors.acceptPrivacy = 'Privacy consent is required.'
  }

  return errors
}

export function validateRegisterForm(form: RegisterPayload) {
  return {
    ...validateRegisterStep(form, 0),
    ...validateRegisterStep(form, 1),
    ...validateRegisterStep(form, 2),
    ...validateRegisterStep(form, 4),
  }
}

export function firstInvalidStep(form: RegisterPayload) {
  for (const step of [0, 1, 2, 4] as const) {
    if (Object.keys(validateRegisterStep(form, step)).length) return step
  }
  return 5
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe: boolean
}

export interface AuthSession {
  token: string
  user: AuthUser
}

export interface ForgotPasswordPayload {
  email: string
}

export interface RegisterAccount {
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterPersonal {
  firstName: string
  lastName: string
  phone: string
  zipCode: string
}

export interface RegisterDemographics {
  ageRange: string
  gender: string
  householdIncome: string
  educationLevel: string
  employmentStatus: string
  householdSize: string
}

export interface RegisterLifestyle {
  shoppingMethod: string
  monthlyBudget: string
  primaryDevice: string
  shoppingInterests: string[]
}

export interface RegisterPreferences {
  surveyTime: string
  surveyFrequency: string
  motivation: string
  emailInvitations: boolean
  opportunityUpdates: boolean
  earningTips: boolean
  acceptTerms: boolean
  acceptPrivacy: boolean
}

export interface RegisterPayload
  extends RegisterAccount,
    RegisterPersonal,
    RegisterDemographics,
    RegisterLifestyle,
    RegisterPreferences {}

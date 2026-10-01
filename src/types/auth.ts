import type { Panelist } from './api'

export type AuthUser = Panelist

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

export interface ResetPasswordPayload {
  token: string
  password: string
}

export interface RegisterAccount {
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterPersonal {
  firstName: string
  lastName: string
  /** National mobile number digits; the dialling code comes from `phoneCountry`. */
  phone: string
  /** ISO 3166-1 alpha-2 code of the mobile number's country. */
  phoneCountry: string
  zipCode: string
  /** ISO 3166-1 alpha-2 code. */
  country: string
  /** DD/MM/YYYY as entered. */
  dateOfBirth: string
}

export interface RegisterPayload extends RegisterAccount, RegisterPersonal {
  answers: Record<string, string | string[]>
  emailInvitations: boolean
  opportunityUpdates: boolean
  memberUpdates: boolean
  acceptTerms: boolean
  researchInvitations: boolean
  acceptPrivacy: boolean
  newsConsent: boolean
}

export type RegisterOutcome = {
  status: 'registered'
  needsVerification: boolean
  emailSent: boolean
  emailError?: string
}

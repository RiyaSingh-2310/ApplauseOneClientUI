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
  phone: string
  zipCode: string
}

export interface RegisterPayload extends RegisterAccount, RegisterPersonal {
  answers: Record<string, string | string[]>
  emailInvitations: boolean
  opportunityUpdates: boolean
  earningTips: boolean
  acceptTerms: boolean
  acceptPrivacy: boolean
}

export type RegisterOutcome = {
  status: 'registered'
  needsVerification: boolean
  emailSent: boolean
  emailError?: string
}

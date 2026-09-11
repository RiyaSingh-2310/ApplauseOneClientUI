import type { AuthSession, AuthUser, ForgotPasswordPayload, LoginPayload, RegisterPayload } from '@/types/auth'
import { apiRequest } from './http'

export const authService = {
  login(payload: LoginPayload) {
    return apiRequest<AuthSession>('/auth/login', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },
  register(payload: RegisterPayload) {
    return apiRequest<AuthSession>('/auth/register', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },
  forgotPassword(payload: ForgotPasswordPayload) {
    return apiRequest<{ ok: boolean }>('/auth/forgot-password', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },
  me() {
    return apiRequest<AuthUser>('/auth/me')
  },
}

import type { AuthSession, ForgotPasswordPayload, LoginPayload, ResetPasswordPayload } from '@/types/auth'
import type { AuthSuccessData, Panelist } from '@/types/api'
import { ApiRequestError } from './errors'
import { apiRequest } from './http'

function requireSession(data: AuthSuccessData | undefined, fallback: string): AuthSession {
  if (!data?.token || !data.user) {
    throw new ApiRequestError({ message: fallback })
  }
  return { token: data.token, user: data.user }
}

export const authService = {
  login(payload: Pick<LoginPayload, 'email' | 'password'>) {
    return apiRequest<AuthSuccessData>('/auth/login', {
      method: 'POST',
      body: { email: payload.email, password: payload.password },
      auth: false,
    }).then((data) => requireSession(data, 'Login did not return a session.'))
  },
  register(payload: { name: string; email: string; password: string; phone?: string }) {
    const body: Record<string, string> = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    }
    if (payload.phone) body.phone = payload.phone
    return apiRequest<AuthSuccessData>('/auth/register', {
      method: 'POST',
      body,
      auth: false,
    })
  },
  verify(token: string) {
    return apiRequest<AuthSuccessData>('/auth/verify', {
      method: 'POST',
      body: { token },
      auth: false,
    }).then((data) => requireSession(data, 'Verification did not return a session.'))
  },
  forgotPassword(payload: ForgotPasswordPayload) {
    return apiRequest<{ reset_token?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },
  resetPassword(payload: ResetPasswordPayload) {
    return apiRequest<unknown>('/auth/reset-password', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },
  logout() {
    return apiRequest<unknown>('/auth/logout', { method: 'POST' })
  },
  me() {
    return apiRequest<{ user: Panelist }>('/me').then((data) => data.user)
  },
  updateMe(payload: { name?: string; phone?: string }) {
    return apiRequest<{ user: Panelist }>('/me', {
      method: 'PUT',
      body: payload,
    }).then((data) => data.user)
  },
  uploadPhoto(file: File) {
    const body = new FormData()
    body.append('photo', file)
    return apiRequest<{ user: Panelist }>('/me/photo', {
      method: 'POST',
      body,
    }).then((data) => data.user)
  },
}

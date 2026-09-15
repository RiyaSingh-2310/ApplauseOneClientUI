import type { AuthSession, ForgotPasswordPayload, LoginPayload, ResetPasswordPayload } from '@/types/auth'
import type { AuthSuccessData, Panelist } from '@/types/api'
import { ApiRequestError } from './errors'
import { apiRequest } from './http'

function requireUser(data: Panelist | { user: Panelist } | undefined): Panelist {
  if (data && typeof data === 'object' && 'user' in data && data.user?.email) return data.user
  if (data && typeof data === 'object' && 'email' in data && data.email) return data
  throw new ApiRequestError({ message: 'Unable to load your profile.' })
}

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
    return apiRequest<AuthSuccessData | undefined>('/auth/verify', {
      method: 'POST',
      body: { token },
      auth: false,
    })
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
  changePassword(payload: { currentPassword: string; password: string }) {
    return apiRequest<unknown>('/auth/change-password', {
      method: 'POST',
      body: {
        current_password: payload.currentPassword,
        password: payload.password,
        password_confirmation: payload.password,
      },
    })
  },
  logout() {
    return apiRequest<unknown>('/auth/logout', { method: 'POST' })
  },
  me() {
    return apiRequest<Panelist | { user: Panelist }>('/me').then(requireUser)
  },
  updateMe(payload: { name?: string; phone?: string }) {
    return apiRequest<Panelist | { user: Panelist }>('/me', {
      method: 'PUT',
      body: payload,
    }).then(requireUser)
  },
  uploadPhoto(file: File) {
    const body = new FormData()
    body.append('photo', file)
    return apiRequest<Panelist | { user: Panelist }>('/me/photo', {
      method: 'POST',
      body,
    }).then(requireUser)
  },
}

import type { AuthSession, ForgotPasswordPayload, LoginPayload, ResetPasswordPayload } from '@/types/auth'
import type { AuthSuccessData, Panelist } from '@/types/api'
import { ApiRequestError } from './errors'
import { apiRequest } from './http'

const verifyInFlight = new Map<string, Promise<undefined>>()

function requireUser(data: Panelist | { user: Panelist } | undefined): Panelist {
  if (data && typeof data === 'object' && 'user' in data && data.user?.email) return data.user
  if (data && typeof data === 'object' && 'email' in data && data.email) return data
  throw new ApiRequestError({ message: 'Unable to load your profile.' })
}

function isUnverifiedPanelist(user: Panelist) {
  const status = String(user.status ?? '').toLowerCase()
  return user.is_verified === 0 || status === 'inactive' || status === 'pending'
}

function requireSession(data: AuthSuccessData | undefined, fallback: string): AuthSession {
  if (!data?.token || !data.user) {
    throw new ApiRequestError({ message: fallback })
  }
  if (isUnverifiedPanelist(data.user)) {
    throw new ApiRequestError({ message: 'Please verify your email before logging in.' }, 403)
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
    // POST /auth/register only. Backend sends the activation email.
    // Never auto-call /auth/resend-activation. Never persist a registration token as a session.
    return apiRequest<AuthSuccessData | undefined>('/auth/register', {
      method: 'POST',
      body,
      auth: false,
    }).then((data) => ({
      // Strict: only treat as sent when backend sets email_sent === true.
      emailSent: data?.email_sent === true,
      emailError: typeof data?.email_error === 'string' ? data.email_error : undefined,
    }))
  },
  verify(token: string) {
    const existing = verifyInFlight.get(token)
    if (existing) return existing
    const request = apiRequest<AuthSuccessData | undefined>('/auth/verify', {
      method: 'POST',
      body: { token },
      auth: false,
    })
      .then(() => undefined)
      .catch((error) => {
        verifyInFlight.delete(token)
        throw error
      })
    verifyInFlight.set(token, request)
    return request
  },
  resendActivation(email: string) {
    return apiRequest<AuthSuccessData | undefined>('/auth/resend-activation', {
      method: 'POST',
      body: { email },
      auth: false,
    }).then((data) => {
      if (data && data.email_sent === false) {
        throw new ApiRequestError(
          { message: data.email_error || 'Could not send activation email. Please try again later.' },
          502,
        )
      }
      return { emailSent: data?.email_sent !== false }
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

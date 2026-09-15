export const DEFAULT_API_BASE_URL = 'https://arserviceco.com/applauseoneapi'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '')

export const CLIENT_BASE_URL = (
  import.meta.env.VITE_CLIENT_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '')
).replace(/\/$/, '')

export function clientVerifyEmailUrl(token: string) {
  return `${CLIENT_BASE_URL}/verify-email?token=${encodeURIComponent(token)}`
}

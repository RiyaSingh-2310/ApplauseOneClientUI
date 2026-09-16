export const DEFAULT_API_BASE_URL = 'https://arserviceco.com/applauseoneapi'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '')

/** Production Client origin. Backend activation emails must use this host for /verify-email links. */
export const DEFAULT_CLIENT_APP_URL = 'https://applause-one-client-ui.vercel.app'

export const CLIENT_APP_URL = (
  import.meta.env.VITE_CLIENT_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : DEFAULT_CLIENT_APP_URL)
).replace(/\/$/, '')

export function clientVerifyEmailUrl(token: string) {
  return `${CLIENT_APP_URL}/verify-email?token=${encodeURIComponent(token)}`
}

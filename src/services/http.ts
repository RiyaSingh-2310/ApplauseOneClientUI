import { API_BASE_URL } from '@/config/env'
import type { ApiEnvelope } from '@/types/api'
import type { ApiError } from '@/types/common'
import { ApiRequestError, UNAUTHORIZED_EVENT } from './errors'
import { clearToken, readToken } from './token'

export { ApiRequestError }

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
}

function parseFieldErrors(errors: unknown): Record<string, string> | undefined {
  if (!errors || typeof errors !== 'object') return undefined
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    if (Array.isArray(value) && value.length) out[key] = String(value[0])
    else if (typeof value === 'string' && value) out[key] = value
  }
  return Object.keys(out).length ? out : undefined
}

function statusMessage(status: number, fallback: string) {
  if (status === 401) return fallback || 'Your session has expired. Please sign in again.'
  if (status === 403) return fallback || 'You do not have access to this action.'
  if (status === 404) return fallback || 'We could not find that information.'
  if (status === 422) return fallback || 'Please check the highlighted fields and try again.'
  if (status >= 500) return fallback || 'The server is having trouble right now. Please try again.'
  return fallback || 'Something went wrong. Please try again.'
}

function toError(payload: unknown, status: number) {
  const envelope = payload as ApiEnvelope | ApiError | null
  const message =
    envelope && typeof envelope === 'object' && 'message' in envelope && typeof envelope.message === 'string'
      ? envelope.message
      : ''
  const fieldErrors =
    envelope && typeof envelope === 'object' && 'errors' in envelope
      ? parseFieldErrors((envelope as ApiEnvelope).errors)
      : envelope && typeof envelope === 'object' && 'fieldErrors' in envelope
        ? (envelope as ApiError).fieldErrors
        : undefined
  return new ApiRequestError(
    {
      message: statusMessage(status, message),
      fieldErrors,
    },
    status,
  )
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiRequestError({ message: 'API base URL is not configured.' })
  }

  const method = options.method ?? 'GET'
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  if (options.body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const sendAuth = options.auth !== false
  if (sendAuth) {
    const token = readToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body:
        options.body === undefined
          ? undefined
          : isFormData
            ? (options.body as FormData)
            : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiRequestError({
      message: 'Unable to reach the server. Check your connection and try again.',
    })
  }

  if (response.status === 204) {
    return undefined as T
  }

  let payload: unknown = null
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      payload = await response.json()
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    if (response.status === 401 && sendAuth && readToken()) {
      clearToken()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    throw toError(payload, response.status)
  }

  const envelope = payload as ApiEnvelope<T> | null
  if (envelope && typeof envelope === 'object' && 'success' in envelope) {
    if (!envelope.success) {
      throw toError(envelope, response.status)
    }
    return envelope.data as T
  }

  return payload as T
}

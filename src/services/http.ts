import { API_BASE_URL, USE_MOCKS } from '@/config/env'
import type { ApiError } from '@/types/common'
import { mockRequest } from '@/mocks/handlers'
import { ApiRequestError } from './errors'
import { readToken } from './token'

export { ApiRequestError }

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET'

  if (USE_MOCKS) {
    return mockRequest<T>(method, path, options.body)
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.auth !== false) {
    const token = readToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    let error = { message: 'Something went wrong. Please try again.' }
    try {
      error = (await response.json()) as ApiError
    } catch {
      error = { message: response.statusText || error.message }
    }
    throw new ApiRequestError(error)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

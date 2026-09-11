import type { ApiError } from '@/types/common'

export class ApiRequestError extends Error {
  code?: string
  fieldErrors?: Record<string, string>

  constructor(error: ApiError) {
    super(error.message)
    this.name = 'ApiRequestError'
    this.code = error.code
    this.fieldErrors = error.fieldErrors
  }
}

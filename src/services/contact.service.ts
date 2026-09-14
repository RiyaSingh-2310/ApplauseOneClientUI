import type { ContactPayload } from '@/types/contact'
import { ApiRequestError } from './errors'

export const contactService = {
  submit(payload: ContactPayload) {
    void payload
    return Promise.reject(
      new ApiRequestError({
        message:
          'Online messaging is not available yet. Please email admin@arserviceco.com or call +60 3 2731 9315.',
      }),
    )
  },
}

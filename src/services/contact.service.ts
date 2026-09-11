import type { ContactPayload } from '@/types/contact'
import { apiRequest } from './http'

export const contactService = {
  submit(payload: ContactPayload) {
    return apiRequest<{ ok: boolean }>('/contact', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  },
}

import type { ContactPayload } from '@/types/contact'
import { apiRequest } from './http'

/**
 * POST /contact — documented as POST /admin/contact as well.
 * Required body: first_name, last_name, email, subject, message.
 */
export const contactService = {
  submit(payload: ContactPayload) {
    return apiRequest<unknown>('/contact', {
      method: 'POST',
      auth: false,
      body: {
        first_name: payload.firstName.trim(),
        last_name: payload.lastName.trim(),
        email: payload.email.trim(),
        subject: payload.subject.trim(),
        message: payload.message.trim(),
      },
    })
  },
}

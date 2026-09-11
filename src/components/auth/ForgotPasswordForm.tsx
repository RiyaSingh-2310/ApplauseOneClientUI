import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { EMAIL_PATTERN } from '@/lib/validation'
import { ApiRequestError } from '@/services/errors'
import { authService } from '@/services/auth.service'

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email)) {
      setError('Enter the email on your account.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await authService.forgotPassword({ email })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to process your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div>
        <p className="rounded-xl bg-success-soft px-4 py-3 text-sm text-success" role="status">
          Check your email for password reset instructions.
        </p>
        <Button className="mt-6 w-full" variant="outline" type="button" onClick={onBack}>
          Back to login
        </Button>
      </div>
    )
  }

  return (
    <form className="grid gap-5" onSubmit={onSubmit} noValidate>
      {error ? (
        <p className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <Field label="Email Address" htmlFor="forgot-email" required>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Field>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send Reset Link'}
      </Button>
      <button type="button" className="text-sm text-teal hover:underline" onClick={onBack}>
        Back to login
      </button>
    </form>
  )
}

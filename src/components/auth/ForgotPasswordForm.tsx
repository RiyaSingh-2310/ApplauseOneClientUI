import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordField } from '@/components/forms/PasswordField'
import { EMAIL_PATTERN } from '@/lib/validation'
import { ApiRequestError } from '@/services/errors'
import { authService } from '@/services/auth.service'

export function ForgotPasswordForm({
  onBack,
  initialToken = '',
}: {
  onBack: () => void
  initialToken?: string
}) {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState(initialToken)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [stage, setStage] = useState<'request' | 'reset' | 'done'>(initialToken ? 'reset' : 'request')

  async function onRequest(event: FormEvent) {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email)) {
      setError('Enter the email on your account.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const data = await authService.forgotPassword({ email })
      if (data?.reset_token) {
        setToken(data.reset_token)
        setStage('reset')
        return
      }
      setStage('done')
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to process your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function onReset(event: FormEvent) {
    event.preventDefault()
    if (!token.trim()) {
      setError('A reset token is required.')
      return
    }
    if (password.length < 6) {
      setError('Use at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await authService.resetPassword({ token: token.trim(), password })
      setStage('done')
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to reset your password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (stage === 'done') {
    return (
      <div>
        <p className="rounded-xl bg-success-soft px-4 py-3 text-sm text-success" role="status">
          {token && password ? 'Your password has been updated. You can sign in now.' : 'If that email exists, password reset instructions were sent.'}
        </p>
        <Button className="mt-6 w-full" variant="outline" type="button" onClick={onBack}>
          Back to login
        </Button>
      </div>
    )
  }

  if (stage === 'reset') {
    return (
      <form className="grid gap-5" onSubmit={onReset} noValidate>
        {error ? (
          <p className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <p className="text-sm text-ink-soft">Choose a new password for your member account.</p>
        <Field label="New password" htmlFor="reset-password" required>
          <PasswordField
            id="reset-password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        <Field label="Confirm password" htmlFor="reset-confirm" required>
          <PasswordField
            id="reset-confirm"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Field>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update password'}
        </Button>
        <button type="button" className="text-sm text-teal hover:underline" onClick={onBack}>
          Back to login
        </button>
      </form>
    )
  }

  return (
    <form className="grid gap-5" onSubmit={onRequest} noValidate>
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

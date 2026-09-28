import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/config/paths'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordField } from '@/components/forms/PasswordField'
import { PasswordStrength } from '@/components/shared/PasswordStrength'
import { EMAIL_PATTERN, validateNewPassword } from '@/lib/validation'
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
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [sentMessage, setSentMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const [stage, setStage] = useState<'request' | 'sent' | 'reset' | 'done'>(initialToken ? 'reset' : 'request')

  useEffect(() => {
    if (!initialToken.trim()) return
    setStage((current) => (current === 'request' ? 'reset' : current))
  }, [initialToken])

  useEffect(() => {
    if (stage !== 'done') return
    const timer = window.setTimeout(() => {
      navigate(paths.login, { replace: true, state: { passwordReset: true } })
    }, 1600)
    return () => window.clearTimeout(timer)
  }, [stage, navigate])

  async function onRequest(event: FormEvent) {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter the email on your account.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const result = await authService.forgotPassword({ email: email.trim() })
      const message = result.message?.trim()
      if (!message) {
        setError('The server did not confirm that a reset email was sent.')
        return
      }
      setSentMessage(message)
      setStage('sent')
    } catch (err) {
      const requestError = err instanceof ApiRequestError ? err : null
      setError(
        requestError?.fieldErrors?.email ||
          requestError?.message ||
          'Unable to process your request. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function onReset(event: FormEvent) {
    event.preventDefault()
    if (!initialToken.trim()) {
      setError('This reset link is missing a token. Please use the link from your email.')
      return
    }
    const next = validateNewPassword(password, confirmPassword)
    setFieldErrors(next)
    if (Object.keys(next).length) return
    setSubmitting(true)
    setError('')
    try {
      await authService.resetPassword({ token: initialToken.trim(), password })
      setStage('done')
    } catch (err) {
      const requestError = err instanceof ApiRequestError ? err : null
      if (requestError?.fieldErrors?.password) {
        setFieldErrors((current) => ({ ...current, password: requestError.fieldErrors?.password ?? '' }))
      }
      setError(requestError?.message ?? 'Unable to reset your password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (stage === 'sent') {
    return (
      <div>
        <p className="rounded-xl bg-success-soft px-4 py-3 text-sm text-success" role="status">
          {sentMessage}
        </p>
        <Button className="mt-6 w-full" variant="outline" type="button" onClick={onBack}>
          Back to Login
        </Button>
      </div>
    )
  }

  if (stage === 'done') {
    return (
      <div className="text-center">
        <h3 className="font-display text-2xl text-ink">Password Reset Successfully</h3>
        <p className="mt-2 text-sm text-ink-soft">You can now sign in with your new password.</p>
        <Button className="mt-6 w-full" type="button" onClick={onBack}>
          Continue to Login
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
        <Field label="New password" htmlFor="reset-password" required error={fieldErrors.password}>
          <PasswordField
            id="reset-password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        <PasswordStrength password={password} />
        <Field label="Confirm password" htmlFor="reset-confirm" required error={fieldErrors.confirmPassword}>
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
          Back to Login
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
        Back to Login
      </button>
    </form>
  )
}

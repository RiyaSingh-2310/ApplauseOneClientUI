import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PasswordField } from '@/components/forms/PasswordField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { EMAIL_PATTERN } from '@/lib/validation'
import { ApiRequestError } from '@/services/errors'
import { authService } from '@/services/auth.service'

function isUnverifiedLogin(error: ApiRequestError | null) {
  if (!error) return false
  const message = error.message.toLowerCase()
  const mentionsVerify =
    message.includes('verify') ||
    message.includes('not active') ||
    message.includes('inactive') ||
    message.includes('activation') ||
    message.includes('not verified')
  return error.status === 403 || mentionsVerify
}

export function LoginForm({
  idPrefix = 'login',
  redirectTo,
  onForgot,
}: {
  idPrefix?: string
  redirectTo?: string
  onForgot: () => void
}) {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = redirectTo || (location.state as { from?: string } | null)?.from || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [needsVerification, setNeedsVerification] = useState(false)
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [resendMessage, setResendMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSubmitting(true)
    setFormError('')
    setNeedsVerification(false)
    setResendMessage('')
    try {
      await login({ email: email.trim(), password, rememberMe })
      navigate(from.startsWith('/') ? from : '/dashboard', { replace: true })
    } catch (error) {
      const requestError = error instanceof ApiRequestError ? error : null
      if (requestError?.fieldErrors) setErrors((current) => ({ ...current, ...requestError.fieldErrors }))
      if (isUnverifiedLogin(requestError)) {
        setNeedsVerification(true)
        setFormError(requestError?.message || 'Please verify your email before logging in.')
      } else if (requestError?.status === 401) {
        setFormError('Those details did not match our records. Please try again.')
      } else {
        setFormError(requestError?.message ?? 'Unable to sign in. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (user) return null

  return (
    <form className="grid gap-5" onSubmit={onSubmit} noValidate>
      {formError ? (
        <p className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
          {formError}
        </p>
      ) : null}
      {needsVerification ? (
        <div className="rounded-xl bg-teal-soft/60 px-4 py-3 text-sm text-teal-deep">
          <p>Check your inbox for the verification email, then try logging in again.</p>
          <button
            type="button"
            className="mt-2 font-medium underline"
            disabled={resendState === 'sending' || !email.trim()}
            onClick={async () => {
              setResendState('sending')
              setResendMessage('')
              try {
                await authService.resendActivation(email.trim())
                setResendState('sent')
                setResendMessage('If this account is not yet active, we sent another verification email.')
              } catch (error) {
                setResendState('error')
                setResendMessage(
                  error instanceof ApiRequestError ? error.message : 'We could not resend the email. Please try again.',
                )
              }
            }}
          >
            {resendState === 'sending' ? 'Sending…' : 'Resend verification email'}
          </button>
          {resendMessage ? <p className="mt-2">{resendMessage}</p> : null}
        </div>
      ) : null}
      <Field label="Email Address" htmlFor={`${idPrefix}-email`} required error={errors.email}>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Field>
      <Field label="Password" htmlFor={`${idPrefix}-password`} required error={errors.password}>
        <PasswordField
          id={`${idPrefix}-password`}
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Field>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <Checkbox checked={rememberMe} onCheckedChange={(value) => setRememberMe(value === true)} />
          Remember me
        </label>
        <button type="button" className="text-sm font-medium text-teal hover:underline" onClick={onForgot}>
          Forgot Password?
        </button>
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Signing in…' : 'Login'}
      </Button>
    </form>
  )
}

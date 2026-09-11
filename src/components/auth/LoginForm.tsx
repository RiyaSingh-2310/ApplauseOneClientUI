import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import { PasswordField } from '@/components/forms/PasswordField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { EMAIL_PATTERN } from '@/lib/validation'
import { ApiRequestError } from '@/services/errors'

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
  const from = redirectTo || (location.state as { from?: string } | null)?.from || '/panelist/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_PATTERN.test(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSubmitting(true)
    setFormError('')
    try {
      await login({ email, password, rememberMe })
      navigate(from, { replace: true })
    } catch (error) {
      setFormError(error instanceof ApiRequestError ? error.message : 'Unable to sign in. Please try again.')
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
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
      <Button type="submit" variant="outline" className="w-full" disabled={submitting}>
        <UserRound />
        Continue as Member
      </Button>
    </form>
  )
}

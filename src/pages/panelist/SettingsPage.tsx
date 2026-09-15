import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingFields } from '@/components/forms/join/OnboardingFields'
import { PasswordField } from '@/components/forms/PasswordField'
import { PasswordStrength } from '@/components/shared/PasswordStrength'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { NumericInput } from '@/components/ui/numeric-input'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { paths } from '@/config/paths'
import { useAuth } from '@/hooks/useAuth'
import { useAsync } from '@/hooks/useAsync'
import { answersToValues, buildOnboardingPayload, flattenQuestions } from '@/lib/apiMap'
import { digitsOnly } from '@/lib/numeric'
import { formatDate, mediaUrl } from '@/lib/utils'
import { PHONE_PATTERN, validateNewPassword } from '@/lib/validation'
import { authService } from '@/services/auth.service'
import { onboardingService } from '@/services/onboarding.service'
import { panelistService } from '@/services/panelist.service'
import { ApiRequestError } from '@/services/errors'
import type { OnboardingAnswerInput } from '@/types/api'

export function SettingsPage() {
  const { refresh, logout } = useAuth()
  const navigate = useNavigate()
  const { data, loading, error, reload } = useAsync(() => panelistService.getProfile())
  const [draft, setDraft] = useState<{
    name: string
    phone: string
    answers: Record<string, string | string[]>
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const seeded = data
    ? {
        name: data.user.name,
        phone: digitsOnly(data.user.phone ?? '', 15),
        answers: answersToValues(data.answers),
      }
    : null
  const form = draft ?? seeded
  const questions = useMemo(() => flattenQuestions(data?.steps ?? []), [data])

  function setForm(updater: (current: NonNullable<typeof form>) => NonNullable<typeof form>) {
    if (!form) return
    setDraft(updater(form))
  }

  function updateAnswer(questionId: number, value: string | string[]) {
    setForm((current) => ({
      ...current,
      answers: { ...current.answers, [String(questionId)]: value },
    }))
  }

  async function onSave() {
    if (!data || !form) return
    if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) {
      setSaveError('Enter 7 to 15 digits, with no letters or symbols.')
      return
    }
    setSaving(true)
    setSaveError('')
    setMessage('')
    try {
      await authService.updateMe({ name: form.name.trim(), phone: form.phone.trim() })
      const payload: OnboardingAnswerInput[] = buildOnboardingPayload(questions, form.answers, {
        acceptTerms: true,
        acceptPrivacy: true,
        emailInvitations: true,
      })
      const editable = payload.filter((item) => {
        const question = questions.find((entry) => entry.id === item.question_id)
        return question && question.step_no !== 5
      })
      if (editable.length) await onboardingService.saveAnswers(editable)
      await refresh()
      setDraft(null)
      setMessage('Your account details were updated.')
      reload()
    } catch (err) {
      setSaveError(err instanceof ApiRequestError ? err.message : 'Unable to save your profile.')
    } finally {
      setSaving(false)
    }
  }

  async function onPhoto(file?: File) {
    if (!file) return
    setUploading(true)
    setSaveError('')
    setMessage('')
    try {
      await authService.uploadPhoto(file)
      await refresh()
      setMessage('Photo updated.')
      reload()
    } catch (err) {
      setSaveError(err instanceof ApiRequestError ? err.message : 'Unable to upload that photo.')
    } finally {
      setUploading(false)
    }
  }

  async function onLogout() {
    setLoggingOut(true)
    try {
      navigate(paths.home)
      await logout()
    } finally {
      setLoggingOut(false)
      setConfirmLogout(false)
    }
  }

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <LoadingSkeleton rows={5} />
      </div>
    )
  }
  if (error && !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ErrorState message={error} onRetry={reload} />
      </div>
    )
  }
  if (!data || !form) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <EmptyState title="Your account could not be loaded." />
      </div>
    )
  }

  const photo = mediaUrl(data.user.photo)
  const grouped = data.steps.filter((step) => Number(step.step_no) !== 5)

  return (
    <div>
      <section className="hero-grid px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-teal uppercase">Your account</p>
          <h1 className="font-display mt-3 text-4xl text-ink sm:text-5xl">Settings</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-ink-soft">
            Update your personal details, keep your research profile current, and manage how you sign in.
          </p>
          <p className="mt-3 text-sm text-muted">Member since {formatDate(data.user.created_at)}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        {message ? <p className="rounded-xl bg-success-soft px-4 py-3 text-sm text-success">{message}</p> : null}
        {saveError ? <p className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">{saveError}</p> : null}

        <Section
          title="Personal information"
          description="These details appear on your member account. Email stays tied to the address you registered with."
        >
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center overflow-hidden rounded-full bg-teal text-sm font-semibold text-white">
              {photo ? <img src={photo} alt="" className="size-full object-cover" /> : data.user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={data.user.is_verified ? 'success' : 'warning'}>
                  {data.user.is_verified ? 'Verified' : 'Unverified'}
                </Badge>
                <Badge tone={data.user.onboarding_completed_at ? 'success' : 'warning'}>
                  {data.user.onboarding_completed_at ? 'Profile complete' : 'Profile incomplete'}
                </Badge>
              </div>
              <label className="mt-3 inline-flex cursor-pointer text-sm font-medium text-teal hover:underline">
                {uploading ? 'Uploading…' : 'Upload photo'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="sr-only"
                  onChange={(event) => void onPhoto(event.target.files?.[0])}
                />
              </label>
            </div>
          </div>
          <Field label="Full name" htmlFor="settings-name">
            <Input
              id="settings-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </Field>
          <Field label="Email" htmlFor="settings-email" hint="Email cannot be changed here.">
            <Input id="settings-email" value={data.user.email} readOnly />
          </Field>
          <Field label="Phone number" htmlFor="settings-phone">
            <NumericInput
              id="settings-phone"
              autoComplete="tel"
              integer
              maxDigits={15}
              value={form.phone}
              onValueChange={(value) => setForm((current) => ({ ...current, phone: value }))}
            />
          </Field>
          <div className="flex justify-end">
            <Button onClick={() => void onSave()} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </Section>

        <ChangePasswordForm />

        {grouped.map((step) => (
          <Section key={step.step_no} title={step.step_name} description="Used to match relevant studies to your profile.">
            <OnboardingFields
              questions={flattenQuestions([step])}
              values={form.answers}
              errors={{}}
              onChange={updateAnswer}
            />
            <div className="flex justify-end">
              <Button onClick={() => void onSave()} disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </Section>
        ))}

        <Section title="Log out" description="Sign out of this browser. You can always sign back in from the public site.">
          <Button variant="outline" onClick={() => setConfirmLogout(true)}>
            Log out
          </Button>
        </Section>
      </div>

      <Dialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <DialogContent title="Log out of Applause One?" description="You’ll return to the public website. Your points and profile stay saved.">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmLogout(false)}>
              Stay signed in
            </Button>
            <Button variant="danger" onClick={() => void onLogout()} disabled={loggingOut}>
              {loggingOut ? 'Signing out…' : 'Log out'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p> : null}
        <div className="mt-5 grid gap-4">{children}</div>
      </CardContent>
    </Card>
  )
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const next = validateNewPassword(password, confirmPassword)
    if (!currentPassword) next.currentPassword = 'Enter your current password.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSubmitting(true)
    setFormError('')
    setMessage('')
    try {
      await authService.changePassword({ currentPassword, password })
      setCurrentPassword('')
      setPassword('')
      setConfirmPassword('')
      setMessage('Your password was updated.')
    } catch (error) {
      setFormError(error instanceof ApiRequestError ? error.message : 'Unable to update your password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Section title="Change password" description="Use a unique password with at least 8 characters, including a letter and a number.">
      <form className="grid gap-4" onSubmit={onSubmit} noValidate>
        {message ? <p className="rounded-xl bg-success-soft px-4 py-3 text-sm text-success">{message}</p> : null}
        {formError ? (
          <p className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
            {formError}
          </p>
        ) : null}
        <Field label="Current password" htmlFor="current-password" required error={errors.currentPassword}>
          <PasswordField
            id="current-password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </Field>
        <Field label="New password" htmlFor="new-password" required error={errors.password}>
          <PasswordField
            id="new-password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        <PasswordStrength password={password} />
        <Field label="Confirm new password" htmlFor="confirm-new-password" required error={errors.confirmPassword}>
          <PasswordField
            id="confirm-new-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Updating…' : 'Update password'}
          </Button>
        </div>
      </form>
    </Section>
  )
}

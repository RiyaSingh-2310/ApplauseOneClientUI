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
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/forms/PhoneInput'
import { paths } from '@/config/paths'
import { composePhone, parsePhone } from '@/content/countries'
import { profileSectionCopy, type ProfileSectionId } from '@/content/profileQuestions'
import { useAuth } from '@/hooks/useAuth'
import { useAsync } from '@/hooks/useAsync'
import { digitsOnly } from '@/lib/numeric'
import {
  answersToFormValues,
  buildProfileAnswers,
  buildProfileSections,
  isProfessionalEmployment,
  type AnswerValues,
  type FormQuestion,
} from '@/lib/profileQuestions'
import { formatDate, mediaUrl } from '@/lib/utils'
import { PHONE_MAX_DIGITS, validateNewPassword, validatePhone } from '@/lib/validation'
import { authService } from '@/services/auth.service'
import { onboardingService } from '@/services/onboarding.service'
import { panelistService } from '@/services/panelist.service'
import { ApiRequestError } from '@/services/errors'

const settingsSectionIds: ProfileSectionId[] = ['demographics', 'professional', 'lifestyle', 'preferences']

export function SettingsPage() {
  const { refresh, logout } = useAuth()
  const navigate = useNavigate()
  const { data, loading, error, reload } = useAsync(() => panelistService.getProfile())
  const [draft, setDraft] = useState<{
    name: string
    phoneCountry: string
    phone: string
    answers: AnswerValues
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const sections = useMemo(() => {
    const built = buildProfileSections(data?.steps ?? [])
    // Settings only shows questions the API can store.
    for (const id of settingsSectionIds) built[id] = built[id].filter((question) => question.api)
    return built
  }, [data])
  const seeded = useMemo(() => {
    if (!data) return null
    const phone = parsePhone(data.user.phone)
    return {
      name: data.user.name,
      phoneCountry: phone.country,
      phone: digitsOnly(phone.number, PHONE_MAX_DIGITS),
      answers: answersToFormValues(
        data.answers,
        settingsSectionIds.flatMap((id) => sections[id]),
      ),
    }
  }, [data, sections])
  const form = draft ?? seeded
  const visibleSectionIds = form
    ? settingsSectionIds.filter(
        (id) => sections[id].length && (id !== 'professional' || isProfessionalEmployment(sections, form.answers)),
      )
    : []

  function setForm(updater: (current: NonNullable<typeof form>) => NonNullable<typeof form>) {
    if (!form) return
    setDraft(updater(form))
  }

  function updateAnswer(key: string, value: string | string[]) {
    setForm((current) => ({
      ...current,
      answers: { ...current.answers, [key]: value },
    }))
  }

  async function onSave() {
    if (!data || !form || !seeded) return
    const phoneError = validatePhone(form.phoneCountry, form.phone)
    if (phoneError) {
      setSaveError(phoneError)
      return
    }
    setSaving(true)
    setSaveError('')
    setMessage('')
    try {
      const phoneChanged = form.phone !== seeded.phone || form.phoneCountry !== seeded.phoneCountry
      await authService.updateMe({
        name: form.name.trim(),
        phone: phoneChanged ? composePhone(form.phoneCountry, form.phone) : (data.user.phone ?? ''),
      })
      const editable = buildProfileAnswers(
        visibleSectionIds.flatMap((id) => sections[id]),
        form.answers,
      ).answers
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
  if (!data || !form || !seeded) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <EmptyState title="Your account could not be loaded." />
      </div>
    )
  }

  const photo = mediaUrl(data.user.photo)
  const personalDirty =
    form.name.trim() !== seeded.name.trim() || form.phone !== seeded.phone || form.phoneCountry !== seeded.phoneCountry

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
          <Field label="Mobile number" htmlFor="settings-phone" hint="Optional">
            <PhoneInput
              id="settings-phone"
              country={form.phoneCountry}
              number={form.phone}
              maxDigits={PHONE_MAX_DIGITS}
              onCountryChange={(value) => setForm((current) => ({ ...current, phoneCountry: value }))}
              onNumberChange={(value) => setForm((current) => ({ ...current, phone: value }))}
            />
          </Field>
          <div className="flex justify-end">
            <Button onClick={() => void onSave()} disabled={saving || !personalDirty}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </Section>

        <ChangePasswordForm />

        {visibleSectionIds.map((id) => (
          <Section key={id} title={profileSectionCopy[id].heading} description="Used to match relevant studies to your profile.">
            <OnboardingFields
              questions={sections[id]}
              values={form.answers}
              errors={{}}
              onChange={updateAnswer}
            />
            <div className="flex justify-end">
              <Button onClick={() => void onSave()} disabled={saving || !sectionDirty(sections[id], form.answers, seeded.answers)}>
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

function answerKey(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).sort().join('|')
  return String(value ?? '').trim()
}

function sectionDirty(questions: FormQuestion[], current: AnswerValues, original: AnswerValues) {
  return questions.some((question) => answerKey(current[question.key]) !== answerKey(original[question.key]))
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const canUpdate = currentPassword.length > 0 && password.length > 0 && confirmPassword.length > 0 && password === confirmPassword

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const next = validateNewPassword(password, confirmPassword)
    if (!currentPassword) next.currentPassword = 'Enter your current password.'
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length || !canUpdate) return
    setFormError(
      'Your password was not changed. POST /auth/reset-password only accepts the reset token from the email link. Sending the sign-in token makes the API return “Invalid or expired reset token.” Open the link in the reset email to set a new password.',
    )
  }

  return (
    <Section title="Change password" description="Use a unique password with at least 8 characters, including a letter and a number.">
      <form className="grid gap-4" onSubmit={onSubmit} noValidate>
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
          <Button type="submit" disabled={!canUpdate}>
            Update password
          </Button>
        </div>
      </form>
    </Section>
  )
}

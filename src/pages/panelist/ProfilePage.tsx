import { useMemo, useState, type ReactNode } from 'react'
import { OnboardingFields } from '@/components/forms/join/OnboardingFields'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useAsync } from '@/hooks/useAsync'
import { answersToValues, buildOnboardingPayload, flattenQuestions } from '@/lib/apiMap'
import { formatDate, mediaUrl } from '@/lib/utils'
import { authService } from '@/services/auth.service'
import { onboardingService } from '@/services/onboarding.service'
import { panelistService } from '@/services/panelist.service'
import { ApiRequestError } from '@/services/errors'
import type { OnboardingAnswerInput } from '@/types/api'

export function ProfilePage() {
  const { refresh } = useAuth()
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
  const seeded = data
    ? {
        name: data.user.name,
        phone: data.user.phone ?? '',
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
      setMessage('Profile updated.')
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

  if (loading && !data) return <LoadingSkeleton rows={5} />
  if (error && !data) return <ErrorState message={error} onRetry={reload} />
  if (!data || !form) return <EmptyState title="Profile could not be loaded." />

  const photo = mediaUrl(data.user.photo)
  const grouped = data.steps.filter((step) => Number(step.step_no) !== 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-ink">Profile</h1>
          <p className="mt-2 text-ink-soft">Member since {formatDate(data.user.created_at)}.</p>
        </div>
        <Button onClick={() => void onSave()} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
      {message ? <p className="rounded-xl bg-success-soft px-4 py-3 text-sm text-success">{message}</p> : null}
      {saveError ? <p className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">{saveError}</p> : null}

      <Section title="Personal information">
        <div className="flex items-center gap-4 sm:col-span-2">
          <div className="grid size-16 place-items-center overflow-hidden rounded-full bg-teal text-sm font-semibold text-white">
            {photo ? <img src={photo} alt="" className="size-full object-cover" /> : data.user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={data.user.is_verified ? 'success' : 'warning'}>
                {data.user.is_verified ? 'Verified' : 'Unverified'}
              </Badge>
              <Badge tone={data.user.onboarding_completed_at ? 'success' : 'warning'}>
                {data.user.onboarding_completed_at ? 'Onboarding complete' : 'Onboarding incomplete'}
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
        <Field label="Name" htmlFor="profile-name">
          <Input id="profile-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        </Field>
        <ReadRow label="Email" value={data.user.email} />
        <Field label="Phone" htmlFor="profile-phone">
          <Input id="profile-phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
        </Field>
        <ReadRow label="Status" value={data.user.status} />
      </Section>

      {grouped.map((step) => (
        <Section key={step.step_no} title={step.step_name}>
          <div className="sm:col-span-2">
            <OnboardingFields
              questions={flattenQuestions([step])}
              values={form.answers}
              errors={{}}
              onChange={updateAnswer}
            />
          </div>
        </Section>
      ))}
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
      </CardContent>
    </Card>
  )
}

function ReadRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value || '—'}</p>
    </div>
  )
}

import { useState, type ReactNode } from 'react'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  budgetOptions,
  deviceOptions,
  educationOptions,
  employmentOptions,
  genderOptions,
  householdSizeOptions,
  incomeOptions,
  interestOptions,
  optionLabel,
  shoppingMethods,
  surveyFrequencyOptions,
  surveyTimeOptions,
} from '@/content/options'
import { useAsync } from '@/hooks/useAsync'
import { formatDate } from '@/lib/utils'
import { panelistService } from '@/services/panelist.service'
import { ApiRequestError } from '@/services/errors'
import type { PanelistProfile, ProfileUpdatePayload } from '@/types/panelist'

function toForm(data: PanelistProfile): ProfileUpdatePayload {
  return {
    phone: data.phone,
    zipCode: data.zipCode,
    surveyTime: data.surveyTime,
    surveyFrequency: data.surveyFrequency,
    motivation: data.motivation,
    emailInvitations: data.emailInvitations,
    opportunityUpdates: data.opportunityUpdates,
    earningTips: data.earningTips,
    shoppingInterests: data.shoppingInterests,
    primaryDevice: data.primaryDevice,
  }
}

export function ProfilePage() {
  const { data, loading, error, reload } = useAsync(() => panelistService.getProfile())
  const [draft, setDraft] = useState<ProfileUpdatePayload | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const form = draft ?? (data ? toForm(data) : {})

  function setForm(updater: (current: ProfileUpdatePayload) => ProfileUpdatePayload) {
    setDraft(updater(form))
  }

  async function onSave() {
    setSaving(true)
    setSaveError('')
    setMessage('')
    try {
      await panelistService.updateProfile(form)
      setMessage('Profile updated.')
      setDraft(null)
      reload()
    } catch (err) {
      setSaveError(err instanceof ApiRequestError ? err.message : 'Unable to save your profile.')
    } finally {
      setSaving(false)
    }
  }

  function toggleInterest(value: string) {
    setForm((current) => {
      const selected = current.shoppingInterests ?? []
      return {
        ...current,
        shoppingInterests: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      }
    })
  }

  if (loading) return <LoadingSkeleton rows={5} />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!data) return <EmptyState title="Profile could not be loaded." />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-ink">Profile</h1>
          <p className="mt-2 text-ink-soft">Member since {formatDate(data.memberSince)}. Some identity fields stay locked after enrollment.</p>
        </div>
        <Button onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
      {message ? <p className="rounded-xl bg-success-soft px-4 py-3 text-sm text-success">{message}</p> : null}
      {saveError ? <p className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">{saveError}</p> : null}

      <Section title="Personal information">
        <ReadRow label="Name" value={`${data.firstName} ${data.lastName}`} />
        <ReadRow label="Email" value={data.email} />
        <Field label="Phone" htmlFor="profile-phone">
          <Input id="profile-phone" value={form.phone ?? ''} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
        </Field>
        <Field label="ZIP / postal code" htmlFor="profile-zip">
          <Input id="profile-zip" value={form.zipCode ?? ''} onChange={(event) => setForm((current) => ({ ...current, zipCode: event.target.value }))} />
        </Field>
      </Section>

      <Section title="Demographics">
        <ReadRow label="Age range" value={data.ageRange} />
        <ReadRow label="Gender" value={optionLabel(genderOptions, data.gender)} />
        <ReadRow label="Household income" value={optionLabel(incomeOptions, data.householdIncome)} />
        <ReadRow label="Education" value={optionLabel(educationOptions, data.educationLevel)} />
        <ReadRow label="Employment" value={optionLabel(employmentOptions, data.employmentStatus)} />
        <ReadRow label="Household size" value={optionLabel(householdSizeOptions, data.householdSize)} />
      </Section>

      <Section title="Shopping & lifestyle">
        <ReadRow label="Shopping method" value={optionLabel(shoppingMethods, data.shoppingMethod)} />
        <ReadRow label="Monthly shopping budget" value={optionLabel(budgetOptions, data.monthlyBudget)} />
        <div className="sm:col-span-2">
          <Field label="Shopping interests">
            <div className="grid gap-2 sm:grid-cols-2">
              {interestOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={(form.shoppingInterests ?? []).includes(option.value)}
                    onCheckedChange={() => toggleInterest(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </Field>
        </div>
      </Section>

      <Section title="Survey preferences">
        <Field label="Primary device" htmlFor="profile-device">
          <Select
            id="profile-device"
            value={form.primaryDevice ?? ''}
            options={deviceOptions}
            onChange={(event) => setForm((current) => ({ ...current, primaryDevice: event.target.value }))}
          />
        </Field>
        <Field label="Preferred survey time" htmlFor="profile-time">
          <Select
            id="profile-time"
            value={form.surveyTime ?? ''}
            options={surveyTimeOptions}
            onChange={(event) => setForm((current) => ({ ...current, surveyTime: event.target.value }))}
          />
        </Field>
        <Field label="Preferred frequency" htmlFor="profile-frequency">
          <Select
            id="profile-frequency"
            value={form.surveyFrequency ?? ''}
            options={surveyFrequencyOptions}
            onChange={(event) => setForm((current) => ({ ...current, surveyFrequency: event.target.value }))}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Motivation" htmlFor="profile-motivation">
            <Textarea
              id="profile-motivation"
              value={form.motivation ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, motivation: event.target.value }))}
            />
          </Field>
        </div>
      </Section>

      <Section title="Communication preferences">
        <ToggleRow
          label="Email survey invitations"
          checked={Boolean(form.emailInvitations)}
          onChange={(value) => setForm((current) => ({ ...current, emailInvitations: value }))}
        />
        <ToggleRow
          label="New opportunity updates"
          checked={Boolean(form.opportunityUpdates)}
          onChange={(value) => setForm((current) => ({ ...current, opportunityUpdates: value }))}
        />
        <ToggleRow
          label="Tips / earning updates"
          checked={Boolean(form.earningTips)}
          onChange={(value) => setForm((current) => ({ ...current, earningTips: value }))}
        />
      </Section>
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

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3 text-sm sm:col-span-2">
      {label}
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

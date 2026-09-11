import {
  ageRanges,
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
import type { RegisterPayload } from '@/types/auth'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line/80 py-3 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium text-ink sm:text-right">{value || '—'}</dd>
    </div>
  )
}

export function ReviewStep({ form }: { form: RegisterPayload }) {
  const interests = form.shoppingInterests
    .map((value) => optionLabel(interestOptions, value))
    .join(', ')
  const ageOptions = ageRanges.map((value) => ({ value, label: value }))

  return (
    <div className="mt-6">
      <p className="text-sm leading-6 text-ink-soft">
        Review your consumer profile before submitting. You can go back to edit any section.
      </p>
      <dl className="mt-4">
        <Row label="Name" value={`${form.firstName} ${form.lastName}`.trim()} />
        <Row label="Email" value={form.email} />
        <Row label="Phone" value={form.phone} />
        <Row label="ZIP / postal code" value={form.zipCode} />
        <Row label="Age range" value={optionLabel(ageOptions, form.ageRange)} />
        <Row label="Gender" value={optionLabel(genderOptions, form.gender)} />
        <Row label="Household income" value={optionLabel(incomeOptions, form.householdIncome)} />
        <Row label="Household size" value={optionLabel(householdSizeOptions, form.householdSize)} />
        <Row label="Education" value={optionLabel(educationOptions, form.educationLevel)} />
        <Row label="Employment" value={optionLabel(employmentOptions, form.employmentStatus)} />
        <Row label="Shopping method" value={optionLabel(shoppingMethods, form.shoppingMethod)} />
        <Row label="Survey time" value={optionLabel(surveyTimeOptions, form.surveyTime)} />
        <Row label="Survey frequency" value={optionLabel(surveyFrequencyOptions, form.surveyFrequency)} />
        <Row label="Shopping interests" value={interests} />
        <Row
          label="Consents"
          value={[form.acceptTerms && 'Terms', form.acceptPrivacy && 'Privacy'].filter(Boolean).join(' · ') || 'Incomplete'}
        />
      </dl>
    </div>
  )
}

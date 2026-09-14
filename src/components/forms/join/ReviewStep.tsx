import { flattenQuestions, optionLabelById } from '@/lib/apiMap'
import type { OnboardingStepGroup } from '@/types/api'
import type { RegisterPayload } from '@/types/auth'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line/80 py-3 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium text-ink sm:text-right">{value || '—'}</dd>
    </div>
  )
}

export function ReviewStep({ form, steps }: { form: RegisterPayload; steps: OnboardingStepGroup[] }) {
  const questions = flattenQuestions(steps).filter((question) => question.step_no !== 5)

  return (
    <div className="mt-6">
      <p className="text-sm leading-6 text-ink-soft">
        Review your consumer profile before submitting. You can go back to edit any section.
      </p>
      <dl className="mt-4">
        <Row label="Name" value={`${form.firstName} ${form.lastName}`.trim()} />
        <Row label="Email" value={form.email} />
        <Row label="Phone" value={form.phone} />
        {form.zipCode ? <Row label="ZIP / postal code" value={form.zipCode} /> : null}
        {questions.map((question) => {
          const value = form.answers[String(question.id)]
          const display = Array.isArray(value)
            ? value.map((id) => optionLabelById(question.options, id)).join(', ')
            : value
              ? optionLabelById(question.options, value)
              : ''
          return <Row key={question.id} label={question.question_text} value={display} />
        })}
        <Row
          label="Consents"
          value={[form.acceptTerms && 'Terms', form.acceptPrivacy && 'Privacy'].filter(Boolean).join(' · ') || 'Incomplete'}
        />
      </dl>
    </div>
  )
}

import type { ReactNode } from 'react'
import { questionsForApiStep, flattenQuestions, optionLabelById } from '@/lib/apiMap'
import { JOIN_API_STEPS } from '@/lib/validation'
import type { OnboardingQuestion, OnboardingStepGroup } from '@/types/api'
import type { RegisterPayload } from '@/types/auth'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line/80 py-3 last:border-b-0 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium text-ink sm:text-right">{value || '—'}</dd>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-cream/40 px-4 py-2">
      <h4 className="pt-3 text-sm font-semibold tracking-wide text-ink">{title}</h4>
      <dl>{children}</dl>
    </section>
  )
}

function answerDisplay(question: OnboardingQuestion, value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.map((id) => optionLabelById(question.options, id)).join(', ')
  if (value) return optionLabelById(question.options, value)
  return ''
}

export function ReviewStep({ form, steps }: { form: RegisterPayload; steps: OnboardingStepGroup[] }) {
  const demographic = questionsForApiStep(steps, JOIN_API_STEPS[0])
  const lifestyle = questionsForApiStep(steps, JOIN_API_STEPS[1])
  const preferences = questionsForApiStep(steps, JOIN_API_STEPS[2])
  const remaining = flattenQuestions(steps).filter(
    (question) => question.step_no !== 5 && !JOIN_API_STEPS.includes(question.step_no as (typeof JOIN_API_STEPS)[number]),
  )

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm leading-6 text-ink-soft">
        Review your consumer profile before submitting. Use Back to edit any section. Your password is never shown here.
      </p>
      <Section title="Personal Information">
        <Row label="First name" value={form.firstName} />
        <Row label="Last name" value={form.lastName} />
      </Section>
      <Section title="Contact Information">
        <Row label="Email" value={form.email} />
        <Row label="Phone" value={form.phone} />
        <Row label="ZIP / postal code" value={form.zipCode} />
      </Section>
      {demographic.length ? (
        <Section title="Demographic Information">
          {demographic.map((question) => (
            <Row
              key={question.id}
              label={question.question_text}
              value={answerDisplay(question, form.answers[String(question.id)])}
            />
          ))}
        </Section>
      ) : null}
      {lifestyle.length ? (
        <Section title="Lifestyle">
          {lifestyle.map((question) => (
            <Row
              key={question.id}
              label={question.question_text}
              value={answerDisplay(question, form.answers[String(question.id)])}
            />
          ))}
        </Section>
      ) : null}
      {preferences.length ? (
        <Section title="Preferences">
          {preferences.map((question) => (
            <Row
              key={question.id}
              label={question.question_text}
              value={answerDisplay(question, form.answers[String(question.id)])}
            />
          ))}
        </Section>
      ) : null}
      {remaining.length ? (
        <Section title="Additional Information">
          {remaining.map((question) => (
            <Row
              key={question.id}
              label={question.question_text}
              value={answerDisplay(question, form.answers[String(question.id)])}
            />
          ))}
        </Section>
      ) : null}
      <Section title="Privacy & Communication">
        <Row label="Survey invitations" value={form.emailInvitations ? 'Yes' : 'No'} />
        <Row label="Opportunity updates" value={form.opportunityUpdates ? 'Yes' : 'No'} />
        <Row label="Earning tips" value={form.earningTips ? 'Yes' : 'No'} />
        <Row label="Terms of Service" value={form.acceptTerms ? 'Agreed' : 'Not agreed'} />
        <Row label="Privacy consent" value={form.acceptPrivacy ? 'Agreed' : 'Not agreed'} />
      </Section>
    </div>
  )
}

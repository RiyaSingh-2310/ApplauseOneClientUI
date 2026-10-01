import type { ReactNode } from 'react'
import { countryName, findCountry } from '@/content/countries'
import { profileSectionCopy, type ProfileSectionId } from '@/content/profileQuestions'
import { answerDisplay, type ProfileSections } from '@/lib/profileQuestions'
import type { RegisterPayload } from '@/types/auth'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line/80 py-3 last:border-b-0 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-muted sm:max-w-[55%]">{label}</dt>
      <dd className="text-sm font-medium break-words text-ink sm:text-right">{value || '—'}</dd>
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

const yesNo = (value: boolean) => (value ? 'Yes' : 'No')
const agreed = (value: boolean) => (value ? 'Agreed' : 'Not agreed')

export function ReviewStep({
  form,
  sections,
  includeProfessional,
}: {
  form: RegisterPayload
  sections: ProfileSections
  includeProfessional: boolean
}) {
  const dial = findCountry(form.phoneCountry)?.dial
  const phone = form.phone ? `${dial ? `+${dial} ` : ''}${form.phone}` : ''
  const profileIds: ProfileSectionId[] = includeProfessional
    ? ['demographics', 'professional', 'lifestyle', 'preferences']
    : ['demographics', 'lifestyle', 'preferences']

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm leading-6 text-ink-soft">
        Review your details before submitting. Use Back to edit any section. Your password is never shown here.
      </p>
      <Section title="Account Information">
        <Row label="First name" value={form.firstName} />
        <Row label="Last name" value={form.lastName} />
        <Row label="Email" value={form.email} />
        <Row label="Mobile number" value={phone} />
        <Row label="Country of residence" value={countryName(form.country)} />
        <Row label="Date of birth" value={form.dateOfBirth} />
        <Row label="ZIP / postal code" value={form.zipCode} />
      </Section>
      {profileIds.map((id) =>
        sections[id].length ? (
          <Section key={id} title={profileSectionCopy[id].heading}>
            {sections[id].map((question) => (
              <Row key={question.key} label={question.label} value={answerDisplay(question, form.answers[question.key])} />
            ))}
          </Section>
        ) : null,
      )}
      <Section title="Community & Privacy">
        <Row label="Survey invitations via email" value={yesNo(form.emailInvitations)} />
        <Row label="Updates about new research opportunities" value={yesNo(form.opportunityUpdates)} />
        <Row label="Member news, rewards, and special opportunities" value={yesNo(form.memberUpdates)} />
        <Row label="Terms of Use and Privacy Policy" value={agreed(form.acceptTerms)} />
        <Row label="Research invitations" value={yesNo(form.researchInvitations)} />
        <Row label="Privacy consent" value={agreed(form.acceptPrivacy)} />
        <Row label="Applause One news and member updates" value={yesNo(form.newsConsent)} />
      </Section>
    </div>
  )
}

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PasswordField } from '@/components/forms/PasswordField'
import { PhoneInput } from '@/components/forms/PhoneInput'
import { PasswordStrength } from '@/components/shared/PasswordStrength'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { countryOptions } from '@/content/countries'
import { paths } from '@/config/paths'
import { formatDateOfBirthInput } from '@/lib/dateOfBirth'
import { NAME_MAX_LENGTH, PHONE_MAX_DIGITS, ZIP_MAX_LENGTH } from '@/lib/validation'
import type { RegisterPayload } from '@/types/auth'

interface StepProps {
  form: RegisterPayload
  errors: Record<string, string>
  update: <K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) => void
}

export function PersonalStep({ form, errors, update }: StepProps) {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <Field label="First name" htmlFor="firstName" required error={errors.firstName}>
        <Input
          id="firstName"
          placeholder="First name"
          autoComplete="given-name"
          aria-required="true"
          maxLength={NAME_MAX_LENGTH}
          value={form.firstName}
          onChange={(event) => update('firstName', event.target.value)}
        />
      </Field>
      <Field label="Last name" htmlFor="lastName" required error={errors.lastName}>
        <Input
          id="lastName"
          placeholder="Last name"
          autoComplete="family-name"
          aria-required="true"
          maxLength={NAME_MAX_LENGTH}
          value={form.lastName}
          onChange={(event) => update('lastName', event.target.value)}
        />
      </Field>
      <Field label="Email address" htmlFor="email" required error={errors.email} className="sm:col-span-2">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-required="true"
          placeholder="you@email.com"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
        />
      </Field>
      <Field label="Country of residence" htmlFor="country" required error={errors.country}>
        <Select
          id="country"
          autoComplete="country"
          aria-required="true"
          placeholder="Select country"
          options={countryOptions}
          value={form.country}
          onChange={(event) => {
            update('country', event.target.value)
            if (!form.phone.trim() && event.target.value) update('phoneCountry', event.target.value)
          }}
        />
      </Field>
      <Field label="Date of birth" htmlFor="dateOfBirth" required error={errors.dateOfBirth} hint="Format: DD / MM / YYYY">
        <Input
          id="dateOfBirth"
          inputMode="numeric"
          autoComplete="bday"
          aria-required="true"
          placeholder="DD / MM / YYYY"
          maxLength={10}
          value={form.dateOfBirth}
          onChange={(event) => update('dateOfBirth', formatDateOfBirthInput(event.target.value))}
        />
      </Field>
      <Field label="Mobile number" htmlFor="phone" error={errors.phone} hint="Optional">
        <PhoneInput
          id="phone"
          country={form.phoneCountry}
          number={form.phone}
          maxDigits={PHONE_MAX_DIGITS}
          onCountryChange={(value) => update('phoneCountry', value)}
          onNumberChange={(value) => update('phone', value)}
        />
      </Field>
      <Field label="ZIP / postal code" htmlFor="zipCode" error={errors.zipCode} hint="Optional">
        <Input
          id="zipCode"
          placeholder="ZIP or postal code"
          autoComplete="postal-code"
          maxLength={ZIP_MAX_LENGTH}
          value={form.zipCode}
          onChange={(event) => update('zipCode', event.target.value.slice(0, ZIP_MAX_LENGTH))}
        />
      </Field>
      <Field label="Password" htmlFor="password" required error={errors.password} hint="At least 8 characters, with a letter and a number." className="sm:col-span-2">
        <PasswordField id="password" autoComplete="new-password" aria-required="true" value={form.password} onChange={(event) => update('password', event.target.value)} />
      </Field>
      <div className="sm:col-span-2">
        <PasswordStrength password={form.password} />
      </div>
      <Field label="Confirm password" htmlFor="confirmPassword" required error={errors.confirmPassword} className="sm:col-span-2">
        <PasswordField id="confirmPassword" autoComplete="new-password" aria-required="true" value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} />
      </Field>
    </div>
  )
}

function ConsentCheckbox({
  id,
  checked,
  onChange,
  required,
  error,
  children,
}: {
  id: string
  checked: boolean
  onChange: (value: boolean) => void
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-1">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
        aria-required={required || undefined}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-0.5 aria-invalid:border-danger"
      />
      <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer text-sm leading-6 text-ink-soft">
        {children}
      </label>
    </div>
  )
}

function ConsentGroup({
  legend,
  required,
  error,
  errorId,
  children,
}: {
  legend: string
  required?: boolean
  error?: string
  errorId?: string
  children: ReactNode
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="flex items-center gap-1 text-sm font-medium text-ink-soft">
        {legend}
        {required ? (
          <>
            <span className="text-danger" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        ) : null}
      </legend>
      {children}
      {error ? (
        <p id={errorId} className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

function PolicyLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} target="_blank" rel="noopener noreferrer" className="font-medium text-teal underline-offset-2 hover:underline">
      {children}
    </Link>
  )
}

export function PrivacyStep({ form, errors, update }: StepProps) {
  return (
    <div className="mt-6 grid gap-6">
      <fieldset className="space-y-2 rounded-2xl bg-cream p-4">
        <legend className="float-left mb-1 w-full text-sm font-medium text-ink">Communication preferences</legend>
        <ConsentCheckbox id="emailInvitations" checked={form.emailInvitations} onChange={(value) => update('emailInvitations', value)}>
          Send me survey invitations via email
        </ConsentCheckbox>
        <ConsentCheckbox id="opportunityUpdates" checked={form.opportunityUpdates} onChange={(value) => update('opportunityUpdates', value)}>
          Send me updates about new research opportunities
        </ConsentCheckbox>
        <ConsentCheckbox id="memberUpdates" checked={form.memberUpdates} onChange={(value) => update('memberUpdates', value)}>
          Send me member news, rewards, and special opportunities
        </ConsentCheckbox>
      </fieldset>

      <ConsentGroup legend="Terms & Conditions" required error={errors.acceptTerms} errorId="acceptTerms-error">
        <ConsentCheckbox
          id="acceptTerms"
          required
          error={errors.acceptTerms}
          checked={form.acceptTerms}
          onChange={(value) => update('acceptTerms', value)}
        >
          I agree to the Applause One <PolicyLink to={paths.termsConditions}>Terms of Use</PolicyLink> and{' '}
          <PolicyLink to={paths.privacyPolicy}>Privacy Policy</PolicyLink>.
        </ConsentCheckbox>
      </ConsentGroup>

      <section className="space-y-3 rounded-2xl border border-line p-4" aria-labelledby="research-consent-heading">
        <h4 id="research-consent-heading" className="text-sm font-semibold text-ink">
          Research Communication Consent
        </h4>
        <ConsentGroup legend="Research Invitations">
          <ConsentCheckbox
            id="researchInvitations"
            checked={form.researchInvitations}
            onChange={(value) => update('researchInvitations', value)}
          >
            I agree to receive invitations to research studies that may match my profile.
          </ConsentCheckbox>
        </ConsentGroup>
      </section>

      <ConsentGroup legend="Privacy Consent" required error={errors.acceptPrivacy} errorId="acceptPrivacy-error">
        <ConsentCheckbox
          id="acceptPrivacy"
          required
          error={errors.acceptPrivacy}
          checked={form.acceptPrivacy}
          onChange={(value) => update('acceptPrivacy', value)}
        >
          I consent to Applause One processing my personal information for panel membership, profiling, and research
          purposes as described in the <PolicyLink to={paths.privacyPolicy}>Privacy Policy</PolicyLink>.
        </ConsentCheckbox>
      </ConsentGroup>

      <ConsentGroup legend="Optional email/news consent">
        <ConsentCheckbox id="newsConsent" checked={form.newsConsent} onChange={(value) => update('newsConsent', value)}>
          I would like to receive Applause One news, member updates, and special opportunities
        </ConsentCheckbox>
      </ConsentGroup>
    </div>
  )
}

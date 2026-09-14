import { Link } from 'react-router-dom'
import { PasswordField } from '@/components/forms/PasswordField'
import { PasswordStrength } from '@/components/shared/PasswordStrength'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
        <Input id="firstName" placeholder="First name" autoComplete="given-name" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} />
      </Field>
      <Field label="Last name" htmlFor="lastName" required error={errors.lastName}>
        <Input id="lastName" placeholder="Last name" autoComplete="family-name" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} />
      </Field>
      <Field label="Email address" htmlFor="email" required error={errors.email} className="sm:col-span-2">
        <Input id="email" type="email" autoComplete="email" placeholder="you@email.com" value={form.email} onChange={(event) => update('email', event.target.value)} />
      </Field>
      <Field label="Phone number" htmlFor="phone" error={errors.phone} hint="Optional">
        <Input id="phone" placeholder="(555) 555-5555" autoComplete="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
      </Field>
      <Field label="ZIP / postal code" htmlFor="zipCode" error={errors.zipCode} hint="Optional">
        <Input id="zipCode" placeholder="ZIP or postal code" autoComplete="postal-code" value={form.zipCode} onChange={(event) => update('zipCode', event.target.value)} />
      </Field>
      <Field label="Password" htmlFor="password" required error={errors.password} hint="At least 8 characters, with a letter and a number." className="sm:col-span-2">
        <PasswordField id="password" autoComplete="new-password" value={form.password} onChange={(event) => update('password', event.target.value)} />
      </Field>
      <div className="sm:col-span-2">
        <PasswordStrength password={form.password} />
      </div>
      <Field label="Confirm password" htmlFor="confirmPassword" required error={errors.confirmPassword} className="sm:col-span-2">
        <PasswordField id="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} />
      </Field>
    </div>
  )
}

export function PrivacyStep({ form, errors, update }: StepProps) {
  return (
    <div className="mt-6 grid gap-5">
      <div className="space-y-3 rounded-2xl bg-cream p-4">
        <p className="text-sm font-medium text-ink">Communication preferences</p>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <Checkbox checked={form.emailInvitations} onCheckedChange={(value) => update('emailInvitations', value === true)} />
          Send me survey invitations via email
        </label>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <Checkbox checked={form.opportunityUpdates} onCheckedChange={(value) => update('opportunityUpdates', value === true)} />
          Send me updates about new opportunities
        </label>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <Checkbox checked={form.earningTips} onCheckedChange={(value) => update('earningTips', value === true)} />
          Send me tips to maximize earnings
        </label>
      </div>
      <Field label="Terms & Conditions" required error={errors.acceptTerms}>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <Checkbox checked={form.acceptTerms} onCheckedChange={(value) => update('acceptTerms', value === true)} />
          <span>
            I agree to the <Link to="/help" className="text-teal hover:underline">Terms of Service</Link> and{' '}
            <Link to="/help" className="text-teal hover:underline">Privacy Policy</Link>, and consent to receive survey invitations via email.
          </span>
        </label>
      </Field>
      <Field label="Privacy Policy" required error={errors.acceptPrivacy}>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <Checkbox checked={form.acceptPrivacy} onCheckedChange={(value) => update('acceptPrivacy', value === true)} />
          <span>I consent to the processing of my personal data for research purposes as described in the Privacy Policy.</span>
        </label>
      </Field>
    </div>
  )
}

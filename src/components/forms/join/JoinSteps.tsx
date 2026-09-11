import { Link } from 'react-router-dom'
import { PasswordField } from '@/components/forms/PasswordField'
import { PasswordStrength } from '@/components/shared/PasswordStrength'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  ageRanges,
  budgetOptions,
  deviceOptions,
  educationOptions,
  employmentOptions,
  genderOptions,
  householdSizeOptions,
  incomeOptions,
  interestOptions,
  shoppingMethods,
  surveyFrequencyOptions,
  surveyTimeOptions,
} from '@/content/options'
import { cn } from '@/lib/utils'
import type { RegisterPayload } from '@/types/auth'

interface StepProps {
  form: RegisterPayload
  errors: Record<string, string>
  update: <K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) => void
  toggleInterest?: (value: string) => void
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
      <Field label="ZIP / postal code" htmlFor="zipCode" required error={errors.zipCode}>
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

export function DemographicsStep({ form, errors, update }: StepProps) {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <Field label="Age range" htmlFor="ageRange" required error={errors.ageRange}>
        <Select id="ageRange" value={form.ageRange} placeholder="Select age range" options={ageRanges.map((value) => ({ value, label: value }))} onChange={(event) => update('ageRange', event.target.value)} />
      </Field>
      <Field label="Gender" htmlFor="gender" required error={errors.gender}>
        <Select id="gender" value={form.gender} placeholder="Select gender" options={genderOptions} onChange={(event) => update('gender', event.target.value)} />
      </Field>
      <Field label="Household income" htmlFor="householdIncome" required error={errors.householdIncome}>
        <Select id="householdIncome" value={form.householdIncome} placeholder="Select income range" options={incomeOptions} onChange={(event) => update('householdIncome', event.target.value)} />
      </Field>
      <Field label="Household size" htmlFor="householdSize" required error={errors.householdSize}>
        <Select id="householdSize" value={form.householdSize} placeholder="Number of people" options={householdSizeOptions} onChange={(event) => update('householdSize', event.target.value)} />
      </Field>
      <Field label="Education level" htmlFor="educationLevel" required error={errors.educationLevel}>
        <Select id="educationLevel" value={form.educationLevel} placeholder="Select education level" options={educationOptions} onChange={(event) => update('educationLevel', event.target.value)} />
      </Field>
      <Field label="Employment status" htmlFor="employmentStatus" required error={errors.employmentStatus}>
        <Select id="employmentStatus" value={form.employmentStatus} placeholder="Select employment status" options={employmentOptions} onChange={(event) => update('employmentStatus', event.target.value)} />
      </Field>
    </div>
  )
}

export function LifestyleStep({ form, errors, update, toggleInterest }: StepProps) {
  return (
    <div className="mt-6 grid gap-5">
      <Field label="Primary shopping method" required error={errors.shoppingMethod}>
        <div className="grid gap-2 sm:grid-cols-2">
          {shoppingMethods.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center rounded-2xl border px-4 py-3 text-sm',
                form.shoppingMethod === option.value ? 'border-teal bg-teal-soft' : 'border-line bg-cream',
              )}
            >
              <input
                type="radio"
                className="sr-only"
                name="shoppingMethod"
                value={option.value}
                checked={form.shoppingMethod === option.value}
                onChange={() => update('shoppingMethod', option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Monthly shopping budget" htmlFor="monthlyBudget">
          <Select id="monthlyBudget" value={form.monthlyBudget} placeholder="Select spending range" options={budgetOptions} onChange={(event) => update('monthlyBudget', event.target.value)} />
        </Field>
        <Field label="Primary device for surveys" htmlFor="primaryDevice">
          <Select id="primaryDevice" value={form.primaryDevice} placeholder="Select device" options={deviceOptions} onChange={(event) => update('primaryDevice', event.target.value)} />
        </Field>
      </div>
      <Field label="Shopping interests" required error={errors.shoppingInterests} hint="Select categories you shop in so we can match relevant studies.">
        <div className="grid gap-2 sm:grid-cols-2">
          {interestOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm">
              <Checkbox checked={form.shoppingInterests.includes(option.value)} onCheckedChange={() => toggleInterest?.(option.value)} />
              {option.label}
            </label>
          ))}
        </div>
      </Field>
    </div>
  )
}

export function PreferencesStep({ form, update }: StepProps) {
  return (
    <div className="mt-6 grid gap-6">
      <Field label="Preferred survey time">
        <div className="grid gap-2 sm:grid-cols-2">
          {surveyTimeOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center rounded-2xl border px-4 py-3 text-sm',
                form.surveyTime === option.value ? 'border-teal bg-teal-soft' : 'border-line bg-cream',
              )}
            >
              <input
                type="radio"
                className="sr-only"
                name="surveyTime"
                checked={form.surveyTime === option.value}
                onChange={() => update('surveyTime', option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Preferred survey frequency">
        <div className="grid gap-2 sm:grid-cols-2">
          {surveyFrequencyOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center rounded-2xl border px-4 py-3 text-sm',
                form.surveyFrequency === option.value ? 'border-teal bg-teal-soft' : 'border-line bg-cream',
              )}
            >
              <input
                type="radio"
                className="sr-only"
                name="surveyFrequency"
                checked={form.surveyFrequency === option.value}
                onChange={() => update('surveyFrequency', option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </Field>
      <Field label="What motivates you to participate?" htmlFor="motivation" hint="Optional">
        <Textarea id="motivation" placeholder="e.g., extra income, helping improve products..." value={form.motivation} onChange={(event) => update('motivation', event.target.value)} />
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

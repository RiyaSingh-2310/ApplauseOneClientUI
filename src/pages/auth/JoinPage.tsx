import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Lock, ShieldCheck, Sparkles, Gift } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { JoinHero } from '@/components/forms/join/JoinHero'
import { JoinSidebar } from '@/components/forms/join/JoinSidebar'
import { OnboardingFields } from '@/components/forms/join/OnboardingFields'
import { RegistrationProgress } from '@/components/forms/join/RegistrationProgress'
import { RegistrationSuccess } from '@/components/forms/join/RegistrationSuccess'
import { ReviewStep } from '@/components/forms/join/ReviewStep'
import { PersonalStep, PrivacyStep } from '@/components/forms/join/JoinSteps'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { Button } from '@/components/ui/button'
import { joinIncentive, joinTrust } from '@/config/brand'
import { useAuth } from '@/hooks/useAuth'
import { useAsync } from '@/hooks/useAsync'
import { buildOnboardingPayload, flattenQuestions, questionsForApiStep } from '@/lib/apiMap'
import { savePendingOnboarding } from '@/lib/pendingOnboarding'
import { scrollToRegistrationStep } from '@/lib/scrollToStep'
import { useMotionConfig } from '@/lib/motion'
import {
  emptyRegisterForm,
  firstInvalidStep,
  JOIN_API_STEPS,
  isRegisterFormValid,
  isRegisterStepValid,
  registerSteps,
  validateRegisterForm,
  validateRegisterStep,
} from '@/lib/validation'
import { ApiRequestError } from '@/services/errors'
import { onboardingService } from '@/services/onboarding.service'
import type { RegisterPayload } from '@/types/auth'

const trustIcons = [Lock, ShieldCheck, Sparkles, Gift]

export function JoinPage() {
  const { user, register } = useAuth()
  const { duration } = useMotionConfig()
  const questionsState = useAsync(() => onboardingService.getQuestions())
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<RegisterPayload>(emptyRegisterForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')
  const stepSectionRef = useRef<HTMLHeadingElement>(null)
  const skipInitialScroll = useRef(true)
  const current = registerSteps[step] ?? registerSteps[0]
  const isLast = step === registerSteps.length - 1
  const steps = questionsState.data?.steps ?? []
  const stepValid = isRegisterStepValid(form, step, steps)
  const formValid = isRegisterFormValid(form, steps)
  const liveErrors = isLast ? validateRegisterForm(form, steps) : validateRegisterStep(form, step, steps)
  const shownErrors = step === 4 || isLast || Object.keys(errors).length ? liveErrors : errors

  useEffect(() => {
    if (skipInitialScroll.current) {
      skipInitialScroll.current = false
      return
    }
    const timer = window.setTimeout(() => {
      scrollToRegistrationStep(stepSectionRef.current)
    }, 80)
    return () => window.clearTimeout(timer)
  }, [step])

  function update<K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }))
  }

  function updateAnswer(questionId: number, value: string | string[]) {
    setForm((currentForm) => ({
      ...currentForm,
      answers: { ...currentForm.answers, [String(questionId)]: value },
    }))
  }

  function goNext() {
    const nextErrors = validateRegisterStep(form, step, steps)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setFormError('')
    setErrors({})
    setStep((currentStep) => Math.min(currentStep + 1, registerSteps.length - 1))
  }

  async function submitForm() {
    const nextErrors = isLast ? validateRegisterForm(form, steps) : validateRegisterStep(form, step, steps)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      if (isLast) setStep(firstInvalidStep(form, steps))
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      const outcome = await register(form)
      savePendingOnboarding(
        form.email,
        buildOnboardingPayload(flattenQuestions(steps), form.answers, {
          acceptTerms: form.acceptTerms,
          acceptPrivacy: form.acceptPrivacy,
          emailInvitations: form.emailInvitations,
        }),
      )
      setEmailSent(outcome.emailSent)
      setEmailError(outcome.emailError ?? '')
      setSuccess(true)
    } catch (error) {
      const requestError = error instanceof ApiRequestError ? error : null
      if (requestError?.status === 409) {
        setFormError('An account with this email already exists. Try logging in or use a different email.')
      } else {
        setFormError(requestError?.message ?? 'Something went wrong while creating your profile. Please try again.')
      }
      if (requestError?.fieldErrors) {
        setErrors((currentErrors) => ({ ...currentErrors, ...requestError.fieldErrors }))
      }
    } finally {
      setSubmitting(false)
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isLast) {
      goNext()
      return
    }
    if (!formValid) {
      const nextErrors = validateRegisterForm(form, steps)
      setErrors(nextErrors)
      setStep(firstInvalidStep(form, steps))
      return
    }
    void submitForm()
  }

  const reassurance = useMemo(
    () =>
      joinTrust.map((item, index) => {
        const Icon = trustIcons[index] ?? Lock
        return (
          <span key={item} className="inline-flex items-center gap-1.5">
            <Icon className="size-3.5 text-teal" />
            {item}
          </span>
        )
      }),
    [],
  )

  if (user && !success) return <Navigate to="/dashboard" replace />
  if (success) {
    return (
      <RegistrationSuccess email={form.email} emailSent={emailSent} emailError={emailError} />
    )
  }

  return (
    <div className="bg-paper pb-16">
      <JoinHero />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:items-start lg:px-8">
        <JoinSidebar />
        <div>
          {questionsState.loading ? <LoadingSkeleton rows={4} /> : null}
          {questionsState.error ? (
            <ErrorState message={questionsState.error} onRetry={questionsState.reload} />
          ) : null}
          {!questionsState.loading && !questionsState.error && !steps.length ? (
            <EmptyState title="Registration questions are unavailable right now." description="Please try again shortly." />
          ) : null}
          {!questionsState.loading && !questionsState.error && steps.length ? (
            <form className="overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8" onSubmit={onSubmit} noValidate>
              <h2 ref={stepSectionRef} className="font-display scroll-mt-24 text-3xl text-ink sm:text-4xl">
                Create Your Consumer Profile
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">Tell us about yourself to receive relevant survey opportunities.</p>
              <div>
                <div className="mt-6">
                <RegistrationProgress
                  step={step}
                  onSelect={(index) => {
                    if (index <= step) {
                      setErrors({})
                      setStep(index)
                    }
                  }}
                />
              </div>
              <div className="mt-8 border-t border-line pt-6">
                <p className="text-sm text-muted">{current.copy}</p>
                <h3 className="font-display mt-1 text-2xl text-ink">{current.heading}</h3>
              </div>
              {formError ? (
                <div className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
                  <p>{formError}</p>
                  <button type="button" className="mt-2 font-medium underline" onClick={() => void submitForm()}>
                    Try again
                  </button>
                </div>
              ) : null}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration }}
                >
                  {step === 5 ? (
                    <ReviewStep form={form} steps={steps} />
                  ) : step === 0 ? (
                    <PersonalStep form={form} errors={shownErrors} update={update} />
                  ) : step === 4 ? (
                    <PrivacyStep form={form} errors={shownErrors} update={update} />
                  ) : (
                    <OnboardingFields
                      questions={questionsForApiStep(steps, JOIN_API_STEPS[step - 1])}
                      values={form.answers}
                      errors={shownErrors}
                      onChange={updateAnswer}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              </div>
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={step === 0 || submitting}
                  onClick={() => {
                    setErrors({})
                    setStep((currentStep) => currentStep - 1)
                  }}
                >
                  Back
                </Button>
                {isLast ? (
                  <Button type="submit" disabled={submitting || !formValid} className="sm:min-w-64">
                    {submitting ? 'Creating your profile…' : 'Complete Registration'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={!stepValid}
                    title={stepValid ? undefined : 'Complete all required fields to continue'}
                    onClick={goNext}
                  >
                    Continue
                  </Button>
                )}
              </div>
              {isLast ? (
                <p className="mt-4 text-center text-xs leading-5 text-muted">
                  {joinIncentive.label} is shown from configuration and is not a guaranteed earning.
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted">{reassurance}</div>
            </form>
          ) : null}
          <p className="mt-6 text-center text-sm text-muted">
            Already a member?{' '}
            <Link to="/login" className="font-medium text-teal hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

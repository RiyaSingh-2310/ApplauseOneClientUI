import { useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Lock, ShieldCheck, Sparkles, Gift } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
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
import { useMotionConfig } from '@/lib/motion'
import {
  emptyRegisterForm,
  firstInvalidStep,
  JOIN_API_STEPS,
  registerSteps,
  validateRegisterForm,
  validateRegisterStep,
} from '@/lib/validation'
import { ApiRequestError } from '@/services/errors'
import { onboardingService } from '@/services/onboarding.service'
import type { RegisterPayload } from '@/types/auth'

const trustIcons = [Lock, ShieldCheck, Sparkles, Gift]

export function JoinPage() {
  const { user, register, refresh } = useAuth()
  const navigate = useNavigate()
  const { duration } = useMotionConfig()
  const questionsState = useAsync(() => onboardingService.getQuestions())
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<RegisterPayload>(emptyRegisterForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const current = registerSteps[step] ?? registerSteps[0]
  const isLast = step === registerSteps.length - 1
  const steps = questionsState.data?.steps ?? []

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
      if (outcome.status === 'authenticated') {
        const payload = buildOnboardingPayload(flattenQuestions(steps), form.answers, {
          acceptTerms: form.acceptTerms,
          acceptPrivacy: form.acceptPrivacy,
          emailInvitations: form.emailInvitations,
        })
        if (payload.length) {
          try {
            await onboardingService.saveAnswers(payload)
            await refresh()
          } catch (error) {
            setFormError(
              error instanceof ApiRequestError
                ? `${error.message} Your account was created — you can finish these answers in Profile.`
                : 'Your account was created. Please finish onboarding in Profile.',
            )
            setSuccess(true)
            return
          }
        }
        setSuccess(true)
        return
      }
      setNeedsVerification(true)
      setSuccess(true)
    } catch (error) {
      const requestError = error instanceof ApiRequestError ? error : null
      setFormError(requestError?.message ?? 'Something went wrong while creating your profile. Please try again.')
      if (requestError?.fieldErrors) {
        setErrors((currentErrors) => ({ ...currentErrors, ...requestError.fieldErrors }))
      }
    } finally {
      setSubmitting(false)
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
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

  if (user && !success) return <Navigate to="/panelist/dashboard" replace />
  if (success) {
    return (
      <RegistrationSuccess
        needsVerification={needsVerification}
        onContinue={() => navigate('/panelist/dashboard')}
      />
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
              <h2 className="font-display text-3xl text-ink sm:text-4xl">Create Your Consumer Profile</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">Tell us about yourself to receive relevant survey opportunities.</p>
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
                  {isLast ? (
                    <ReviewStep form={form} steps={steps} />
                  ) : step === 0 ? (
                    <PersonalStep form={form} errors={errors} update={update} />
                  ) : step === 4 ? (
                    <PrivacyStep form={form} errors={errors} update={update} />
                  ) : (
                    <OnboardingFields
                      questions={questionsForApiStep(steps, JOIN_API_STEPS[step - 1])}
                      values={form.answers}
                      errors={errors}
                      onChange={updateAnswer}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="outline" disabled={step === 0 || submitting} onClick={() => setStep((currentStep) => currentStep - 1)}>
                  Back
                </Button>
                {isLast ? (
                  <Button type="submit" disabled={submitting} className="sm:min-w-64">
                    {submitting ? 'Creating your profile…' : 'Join Consumer Panel'}
                  </Button>
                ) : (
                  <Button type="button" onClick={goNext}>
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

import { useState } from 'react'
import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useMotionConfig } from '@/lib/motion'
import { maskEmail } from '@/lib/utils'

export function RegistrationSuccess({
  needsVerification = false,
  email,
}: {
  needsVerification?: boolean
  email?: string
}) {
  const { duration } = useMotionConfig()
  const [phase, setPhase] = useState<'email' | 'complete'>(needsVerification ? 'email' : 'complete')

  return (
    <div className="px-4 py-16 sm:px-6">
      <motion.div
        className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-card sm:p-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration }}
      >
        <motion.div
          className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration, delay: 0.08 }}
        >
          <Check className="size-7" />
        </motion.div>
        {phase === 'email' ? (
          <>
            <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-teal uppercase">Check your email</p>
            <h1 className="font-display mt-3 text-4xl text-ink">Verify your account</h1>
            <p className="mt-4 text-ink-soft">
              We’ve sent a verification email{email ? ` to ${maskEmail(email)}` : ''}. Open the message and follow the
              link to activate your account, then continue to confirm your registration.
            </p>
            <Button className="mt-8" type="button" onClick={() => setPhase('complete')}>
              Continue
            </Button>
          </>
        ) : (
          <>
            <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-teal uppercase">Registration complete</p>
            <h1 className="font-display mt-3 text-4xl text-ink">You’re registered with Applause One</h1>
            <p className="mt-4 text-ink-soft">
              Your consumer profile has been created successfully.
              {needsVerification
                ? ' After you verify your email, sign in with your credentials to open your member dashboard.'
                : ' Sign in with your credentials to open your member dashboard.'}
            </p>
            <Button className="mt-8" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}

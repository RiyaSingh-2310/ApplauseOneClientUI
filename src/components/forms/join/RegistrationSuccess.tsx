import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useMotionConfig } from '@/lib/motion'

export function RegistrationSuccess({
  onContinue,
  needsVerification = false,
}: {
  onContinue?: () => void
  needsVerification?: boolean
}) {
  const { duration } = useMotionConfig()

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
        {needsVerification ? (
          <>
            <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-teal uppercase">Check your email</p>
            <h1 className="font-display mt-3 text-4xl text-ink">Verify your account</h1>
            <p className="mt-4 text-ink-soft">
              Your profile was created. Please verify your email before signing in.
            </p>
            <Button className="mt-8" asChild>
              <Link to="/login">Back to login</Link>
            </Button>
          </>
        ) : (
          <>
            <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-teal uppercase">You’re in</p>
            <h1 className="font-display mt-3 text-4xl text-ink">Welcome to Applause One!</h1>
            <p className="mt-4 text-ink-soft">
              Your consumer profile has been successfully created. Assigned studies will appear in the member portal, with the newest project first.
            </p>
            <Button className="mt-8" onClick={onContinue}>
              Continue to Member Portal
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}

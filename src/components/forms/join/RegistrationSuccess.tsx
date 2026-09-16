import { Mail } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { useMotionConfig } from '@/lib/motion'
import { ApiRequestError } from '@/services/errors'
import { authService } from '@/services/auth.service'

export function RegistrationSuccess({ email }: { email?: string }) {
  const { duration } = useMotionConfig()
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [resendMessage, setResendMessage] = useState('')

  async function resend() {
    if (!email || resendState === 'sending') return
    setResendState('sending')
    setResendMessage('')
    try {
      await authService.resendActivation(email)
      setResendState('sent')
      setResendMessage('If this account is not yet active, we sent another verification email.')
    } catch (error) {
      setResendState('error')
      setResendMessage(
        error instanceof ApiRequestError ? error.message : 'We could not resend the email. Please try again.',
      )
    }
  }

  return (
    <div className="px-4 py-16 sm:px-6">
      <motion.div
        className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-card sm:p-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration }}
      >
        <motion.div
          className="mx-auto grid size-14 place-items-center rounded-full bg-teal-soft text-teal"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration, delay: 0.08 }}
        >
          <Mail className="size-7" />
        </motion.div>
        <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-teal uppercase">Almost there</p>
        <h1 className="font-display mt-3 text-4xl text-ink">Check Your Email</h1>
        <p className="mt-4 text-ink-soft">
          We’ve sent a verification link{email ? ` to ${email}` : ' to your registered email address'}. Please open the
          email and click the Verify Email button to activate your account.
        </p>
        <p className="mt-3 text-sm text-ink-soft">Your account stays inactive until you verify. Then you can log in.</p>
        {resendMessage ? (
          <p className={`mt-4 text-sm ${resendState === 'error' ? 'text-danger' : 'text-teal-deep'}`} role="status">
            {resendMessage}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {email ? (
            <Button type="button" variant="outline" disabled={resendState === 'sending'} onClick={() => void resend()}>
              {resendState === 'sending' ? 'Sending…' : 'Resend verification email'}
            </Button>
          ) : null}
          <Button asChild>
            <Link to={paths.login}>Go to Login</Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted">
          <Link to={paths.home} className="font-medium text-teal hover:underline">
            Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

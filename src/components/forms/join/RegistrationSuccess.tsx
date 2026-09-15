import { Mail } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { useMotionConfig } from '@/lib/motion'
import { maskEmail } from '@/lib/utils'

export function RegistrationSuccess({ email }: { email?: string }) {
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
          <Mail className="size-7" />
        </motion.div>
        <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-teal uppercase">Check your email</p>
        <h1 className="font-display mt-3 text-4xl text-ink">Verify your email</h1>
        <p className="mt-4 text-ink-soft">
          We’ve sent a verification email{email ? ` to ${maskEmail(email)}` : ''}. Open the message and select Verify
          Your Email. After your address is confirmed, log in to open your member dashboard.
        </p>
        <Button className="mt-8" asChild>
          <Link to={paths.login}>Go to Login</Link>
        </Button>
      </motion.div>
    </div>
  )
}

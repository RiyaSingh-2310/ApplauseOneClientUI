import { Clock, Gift, Wallet } from 'lucide-react'
import { motion } from 'motion/react'
import { joinHighlights, joinIncentive } from '@/config/brand'
import { useMotionConfig } from '@/lib/motion'

const highlightIcons = [Wallet, Clock, Gift]

export function JoinHero() {
  const { duration } = useMotionConfig()

  return (
    <section className="relative overflow-hidden bg-teal-deep">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute -left-16 top-8 size-64 rounded-full bg-teal/50 blur-3xl" />
        <div className="absolute right-0 -bottom-20 size-80 rounded-full bg-gold/25 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_79_76_/_0.2),rgb(18_32_51_/_0.35))]" />
      </div>
      <motion.div
        className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:py-16"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration }}
      >
        <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">Consumer research panel</p>
        <h1 className="font-display mt-4 text-4xl leading-tight text-white text-balance sm:text-5xl">
          Join the Consumer Research Panel
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
          Share your opinions on everyday products and services while earning rewards for your valuable insights.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {joinHighlights.map((item, index) => {
            const Icon = highlightIcons[index] ?? Gift
            return (
              <div key={item.label} className="text-center">
                <Icon className="mx-auto size-6 text-gold" />
                <p className="font-display mt-2 text-3xl text-white sm:text-4xl">{item.value}</p>
                <p className="mt-1 text-sm text-white/70">{item.label}</p>
              </div>
            )
          })}
        </div>
        <p className="mx-auto mt-6 max-w-xl text-xs leading-5 text-white/55">{joinIncentive.disclaimer}</p>
      </motion.div>
    </section>
  )
}

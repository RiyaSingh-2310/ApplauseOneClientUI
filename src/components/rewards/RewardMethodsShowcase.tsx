import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Button } from '@/components/ui/button'
import { rewardMethods } from '@/content/rewardMethods'
import { RewardMethodMark } from '@/components/rewards/RewardMethodMark'
import { paths } from '@/config/paths'

export function RewardMethodsShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Reward methods"
        title="Redeem the way you prefer"
        description="Choose from popular gift cards, UPI, PayPal, and cash options. Availability is controlled by the rewards catalog."
      />
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9">
        {rewardMethods.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.03, duration: 0.35 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-line/80 bg-white px-3 py-5 text-center shadow-card"
          >
            <RewardMethodMark method={method} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{method.name}</p>
              {method.shortLabel ? (
                <p className="mt-0.5 text-[11px] tracking-wide text-muted uppercase">{method.shortLabel}</p>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link to={paths.rewards}>Browse the catalog</Link>
        </Button>
      </div>
    </section>
  )
}

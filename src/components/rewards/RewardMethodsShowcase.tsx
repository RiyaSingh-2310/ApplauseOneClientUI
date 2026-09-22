import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Button } from '@/components/ui/button'
import { popularRewardMethods } from '@/content/rewardMethods'
import { RewardMethodMark } from '@/components/rewards/RewardMethodMark'
import { TrustedPartnersCarousel } from '@/components/rewards/TrustedPartnersCarousel'
import { paths } from '@/config/paths'
import { useAuth } from '@/hooks/useAuth'

/** Popular/curated products only — never the full Tremendous catalog. */
export function RewardMethodsShowcase() {
  const { user } = useAuth()
  const redeemTo = user ? paths.redeemRewards : paths.rewards

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Popular rewards"
          title="Redeem the way you prefer"
          description="A curated set of popular payout options. Full catalog availability is controlled by your rewards configuration."
        />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {popularRewardMethods.map((method, index) => (
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
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link to={redeemTo}>{user ? 'Redeem Rewards' : 'Browse the catalog'}</Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-line/80 bg-cream/70 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Trusted redemption partners"
            title="Payout brands members recognize"
            description="Popular partner logos for gift cards, UPI, PayPal, and prepaid options — shown as a continuous showcase."
          />
          <div className="mt-10">
            <TrustedPartnersCarousel />
          </div>
        </div>
      </section>
    </>
  )
}

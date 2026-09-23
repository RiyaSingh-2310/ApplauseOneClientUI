import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Button } from '@/components/ui/button'
import { PopularRewardsCarousel } from '@/components/rewards/PopularRewardsCarousel'
import { TrustedPartnersCarousel } from '@/components/rewards/TrustedPartnersCarousel'
import { paths } from '@/config/paths'
import { useAuth } from '@/hooks/useAuth'

/** Popular/curated products only — never the full Tremendous catalog. */
export function RewardMethodsShowcase() {
  const { user } = useAuth()
  const redeemTo = user ? paths.redeemRewards : paths.rewards

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Popular rewards"
          title="Redeem the way you prefer"
          description="A curated set of popular payout options. Full catalog availability is controlled by your rewards configuration."
        />
        <PopularRewardsCarousel />
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link to={redeemTo}>{user ? 'Redeem Rewards' : 'Browse the catalog'}</Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-line/80 bg-cream/70 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

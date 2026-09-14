import { RewardBenefits } from '@/components/rewards/RewardBenefits'
import { RewardCategorySection } from '@/components/rewards/RewardCategorySection'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { CtaSection } from '@/components/shared/CtaSection'
import { FaqAccordion } from '@/components/shared/FaqAccordion'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { instantCashRewards, rewardShowcase, rewardsCta, rewardsFaqs, rewardsHero } from '@/content/rewards'
import { useAuth } from '@/hooks/useAuth'
import { useAsync } from '@/hooks/useAsync'
import { formatNumber } from '@/lib/utils'
import { rewardService } from '@/services/reward.service'
import type { RewardOption } from '@/types/reward'

function orderRewards(items: RewardOption[], ids: readonly string[]) {
  const byId = new Map(items.map((item) => [item.id, item]))
  const ordered = ids.map((id) => byId.get(id)).filter((item): item is RewardOption => Boolean(item))
  const extras = items.filter((item) => !ids.includes(item.id))
  return [...ordered, ...extras]
}

export function RewardsPage() {
  const { user } = useAuth()
  const { data, loading, error, reload } = useAsync(() => rewardService.getCatalog())
  const redeemTo = user ? '/panelist/rewards' : '/join'
  const items = data?.items ?? []

  const cash = orderRewards(
    items.filter((item) => item.category === 'cash'),
    instantCashRewards.map((item) => item.id),
  )
  const giftCards = items.filter((item) => item.category === 'gift-card' || item.category === 'digital')
  const charity = items.filter((item) => item.category === 'charity')

  return (
    <div>
      <PageHero
        eyebrow={rewardsHero.eyebrow}
        title={
          <>
            {rewardsHero.titleLead} <span className="text-teal">{rewardsHero.titleAccent}</span>
          </>
        }
        description={rewardsHero.description}
      >
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {rewardsHero.pills.map((pill) => (
            <span key={pill} className="rounded-full bg-white px-4 py-2 text-sm text-ink-soft shadow-soft">
              {pill}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="px-4 pt-12 sm:px-6 lg:px-8">
        <SectionHeading
          title="Browse Reward Categories"
          description="Choose from instant cash, popular gift cards, digital credit, and donations. Availability is controlled by the catalog."
        />
      </section>

      {loading ? (
        <div className="mx-auto max-w-6xl px-4 py-10">
          <LoadingSkeleton rows={4} />
        </div>
      ) : null}
      {error ? (
        <div className="mx-auto max-w-6xl px-4 py-10">
          <ErrorState message="Unable to load rewards. Please try again." onRetry={reload} />
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          {cash.length === 0 && giftCards.length === 0 && charity.length === 0 ? (
            <div className="mx-auto max-w-6xl px-4 py-10">
              <EmptyState title="No rewards in the catalog yet." description="Check back soon." />
            </div>
          ) : null}
          {cash.length ? (
            <RewardCategorySection
              title={rewardShowcase[0].title}
              description={rewardShowcase[0].description}
              rewards={cash}
              redeemTo={redeemTo}
              featuredId="rwd_paypal"
            />
          ) : null}
          {giftCards.length ? (
            <RewardCategorySection
              title={rewardShowcase[1].title}
              description={rewardShowcase[1].description}
              rewards={giftCards}
              redeemTo={redeemTo}
            />
          ) : null}
          {charity.length ? (
            <RewardCategorySection
              title={rewardShowcase[2].title}
              description={rewardShowcase[2].description}
              rewards={charity}
              redeemTo={redeemTo}
            />
          ) : null}
        </>
      ) : null}

      <RewardBenefits />

      {data?.guide ? (
        <section className="px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-4 rounded-[1.6rem] border border-teal/15 bg-teal-soft/50 px-6 py-8 sm:grid-cols-3 sm:px-8">
            <div className="text-center">
              <p className="font-display text-3xl text-teal">{formatNumber(data.guide.minimumRedemption)}</p>
              <p className="mt-1 text-sm text-ink-soft">Typical minimum points</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl text-teal">{formatNumber(items.length)}</p>
              <p className="mt-1 text-sm text-ink-soft">Catalog options</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl text-teal">0%</p>
              <p className="mt-1 text-sm text-ink-soft">Member signup fees</p>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-5 text-muted">{data.guide.body}</p>
        </section>
      ) : null}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            title="Frequently Asked Questions"
            description="Everything you need to know about redeeming your rewards. Exact values still come from each reward option."
          />
          <FaqAccordion
            className="mt-10"
            items={rewardsFaqs.map((item) =>
              item.q.includes('minimum') && data?.guide
                ? {
                    ...item,
                    a: `Minimums are set per reward. Many options start around ${formatNumber(data.guide.minimumRedemption)} points. Always check the card you want to redeem.`,
                  }
                : item,
            )}
          />
        </div>
      </section>

      <CtaSection
        title={
          <>
            {rewardsCta.titleLead} <span className="text-gold">{rewardsCta.titleAccent}</span>
          </>
        }
        description={rewardsCta.description}
        primary={{ to: '/join', label: rewardsCta.primary }}
        secondary={{ to: '/how-it-works', label: rewardsCta.secondary }}
      />
    </div>
  )
}

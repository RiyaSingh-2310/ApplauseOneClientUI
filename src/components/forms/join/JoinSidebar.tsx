import { Gift, Globe, ShieldCheck, Star, Wallet } from 'lucide-react'
import { joinBenefits, joinBonuses, joinIncentive, joinTopics } from '@/config/brand'

const benefitIcons = [Wallet, Globe, ShieldCheck]

export function JoinSidebar() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
        <h2 className="flex items-center gap-2 font-display text-xl text-ink">
          <Star className="size-4 text-gold" />
          Consumer Benefits
        </h2>
        <ul className="mt-5 space-y-4">
          {joinBenefits.map((item, index) => {
            const Icon = benefitIcons[index] ?? Star
            return (
              <li key={item.title} className="flex gap-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-teal" />
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">{item.copy}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-teal-soft/70 p-5">
        <h2 className="text-sm font-semibold text-ink">Popular Survey Topics</h2>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {joinTopics.map((topic) => (
            <li key={topic} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal" />
              {topic}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gold/30 bg-gold-soft p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Gift className="size-4 text-gold-deep" />
          Bonus Opportunities
        </h2>
        <p className="mt-3 font-display text-2xl text-ink">{joinIncentive.label}</p>
        <ul className="mt-3 space-y-2">
          {joinBonuses.map((item) => (
            <li key={item} className="text-sm leading-6 text-ink-soft">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-5 text-muted">{joinIncentive.disclaimer}</p>
      </section>
    </aside>
  )
}

import { CheckCircle2, Clock, Gift, Monitor, UserRound } from 'lucide-react'
import { supportHours, quickHelpTopics, whyContactUs } from '@/content/contact'

const topicIcons = {
  user: UserRound,
  gift: Gift,
  monitor: Monitor,
}

export function SupportHours() {
  return (
    <aside className="space-y-4">
      <section className="rounded-[1.6rem] border border-line bg-white p-6 shadow-card">
        <h3 className="flex items-center gap-2 font-display text-xl text-ink">
          <Clock className="size-5 text-teal" />
          Support Hours
        </h3>
        <p className="mt-1 text-sm text-ink-soft">Our team is available during these hours</p>
        <dl className="mt-5 space-y-3 text-sm">
          {supportHours.map((item) => (
            <div key={item.days} className="flex items-start justify-between gap-4">
              <dt className="text-ink-soft">{item.days}</dt>
              <dd className="text-right font-medium text-ink">{item.hours}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-[1.6rem] border border-line bg-white p-6 shadow-card">
        <h3 className="font-display text-xl text-ink">Quick Help Topics</h3>
        <ul className="mt-5 space-y-4">
          {quickHelpTopics.map((item) => {
            const Icon = topicIcons[item.icon]
            return (
              <li key={item.title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-teal-soft text-teal">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{item.copy}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rounded-[1.6rem] border border-success/20 bg-success-soft/60 p-6">
        <h3 className="font-display text-xl text-ink">Why Contact Us?</h3>
        <ul className="mt-4 space-y-2">
          {whyContactUs.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}

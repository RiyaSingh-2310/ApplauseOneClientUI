import { CheckCircle2, Coins, Gift, Sparkles } from 'lucide-react'
import type { ActivityItem } from '@/types/panelist'
import { formatRelativeTime } from '@/lib/utils'

const icons = {
  points: Coins,
  reward: Gift,
  project: Sparkles,
  profile: CheckCircle2,
}

export function ActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="relative mt-5 space-y-0 border-l border-line pl-5">
      {items.map((item) => {
        const Icon = icons[item.kind] ?? Sparkles
        return (
          <li key={item.id} className="relative pb-5 last:pb-0">
            <span className="absolute top-0.5 -left-[1.6rem] grid size-7 place-items-center rounded-full border border-line bg-white text-teal shadow-soft">
              <Icon className="size-3.5" />
            </span>
            <p className="text-sm font-medium text-ink">{item.title}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{item.detail}</p>
            <p className="mt-1 text-xs text-muted">{formatRelativeTime(item.occurredAt)}</p>
          </li>
        )
      })}
    </ol>
  )
}

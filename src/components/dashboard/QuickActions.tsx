import { Gift, History, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { paths } from '@/config/paths'
import { cardLiftClass } from '@/lib/motion'
import { cn } from '@/lib/utils'

const actions = [
  { to: paths.rewards, label: 'Choose a Reward', copy: 'Request a payout with your available points.', icon: Gift },
  { to: paths.history, label: 'View History', copy: 'See reward requests and points in one place.', icon: History },
  { to: paths.settings, label: 'Manage Profile', copy: 'Keep your account details up to date.', icon: UserRound },
]

export function QuickActions() {
  return (
    <div className="grid gap-4">
      {actions.map((action) => (
        <Link key={action.to} to={action.to} className="block h-full">
          <Card className={cn('h-full', cardLiftClass)}>
            <CardContent className="flex h-full items-start gap-3 pt-5 sm:gap-4 sm:pt-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-teal-soft text-teal sm:size-11">
                <action.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-lg text-ink sm:text-xl">{action.label}</h3>
                <p className="mt-1 text-sm leading-6 text-ink-soft">{action.copy}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

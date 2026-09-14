import { Gift, History, ClipboardList, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { paths } from '@/config/paths'
import { cardLiftClass } from '@/lib/motion'
import { cn } from '@/lib/utils'

const actions = [
  { to: paths.rewards, label: 'Browse Rewards', copy: 'Redeem points for cash, cards, and more.', icon: Gift },
  { to: paths.history, label: 'View History', copy: 'See rewards and earnings in one place.', icon: History },
  { to: paths.surveys, label: 'Find Surveys', copy: 'Open studies assigned to your profile.', icon: ClipboardList },
  { to: paths.settings, label: 'Manage Profile', copy: 'Keep your account details up to date.', icon: UserRound },
]

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {actions.map((action) => (
        <Link key={action.to} to={action.to} className="block h-full">
          <Card className={cn('h-full', cardLiftClass)}>
            <CardContent className="flex h-full items-start gap-4 pt-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-teal-soft text-teal">
                <action.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-xl text-ink">{action.label}</h3>
                <p className="mt-1 text-sm leading-6 text-ink-soft">{action.copy}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'
import { useAsync } from '@/hooks/useAsync'
import { useMotionConfig } from '@/lib/motion'
import { formatDate, formatNumber, givenName } from '@/lib/utils'
import { panelistService } from '@/services/panelist.service'

export function DashboardPage() {
  const { user } = useAuth()
  const { duration } = useMotionConfig()
  const { data, loading, error, reload } = useAsync(() => panelistService.getDashboard())

  if (loading) return <LoadingSkeleton rows={5} />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!data) return <EmptyState title="Dashboard is unavailable right now." />

  const { summary, activity, latestProjects, pointsTrend } = data
  const progress = Math.min(100, Math.round((summary.availablePoints / summary.nextRewardAt) * 100) || 0)
  const onboardingIncomplete = Boolean(user && !user.onboarding_completed_at)

  const cards = [
    { label: 'Available reward points', value: summary.availablePoints, suffix: 'Points' },
    { label: 'Redeemed points', value: summary.redeemedPoints, suffix: 'Points' },
    { label: 'Pending reward requests', value: summary.pendingRequests, suffix: 'Open' },
    { label: 'Assigned projects', value: summary.assignedProjects, suffix: 'Active + recent' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted">Welcome back</p>
        <h1 className="font-display text-4xl text-ink">{givenName(user?.name)}, your panel is ready.</h1>
      </div>

      {onboardingIncomplete ? (
        <div className="rounded-2xl border border-gold/30 bg-gold-soft px-5 py-4 text-sm text-gold-deep">
          Finish your profile so matching can use your latest answers.{' '}
          <Link to="/panelist/profile" className="font-medium underline">
            Complete profile
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: index * 0.04 }}
          >
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs tracking-[0.16em] text-muted uppercase">{card.label}</p>
                <p className="font-display mt-3 text-4xl text-ink">
                  <AnimatedCounter value={card.value} />
                </p>
                <p className="mt-1 text-sm text-ink-soft">{card.suffix}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl">Reward progress</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  {formatNumber(summary.availablePoints)} of {formatNumber(summary.nextRewardAt)} points toward your next typical cash-out threshold.
                </p>
              </div>
              <p className="font-display text-2xl text-teal">{progress}%</p>
            </div>
            <Progress className="mt-5" value={progress} />
            <div className="mt-8 h-40">
              {pointsTrend.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pointsTrend}>
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7a88' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="points" stroke="#0f6e6a" fill="#e3f2f0" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="No point history yet." />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="font-display text-2xl">How to earn more</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-soft">
              <li>Open Assigned Projects and complete anything marked New first.</li>
              <li>Keep shopping interests current so matching stays accurate.</li>
              <li>Finish in-progress studies before they expire.</li>
              <li>Redeem only when a specific reward’s point requirement is met.</li>
            </ul>
            <Button asChild className="mt-6" variant="outline">
              <Link to="/panelist/projects">View assigned projects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Latest assigned projects</h2>
              <Link to="/panelist/projects" className="text-sm text-teal hover:underline">
                See all
              </Link>
            </div>
            {latestProjects.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No projects assigned yet." description="When a study is matched to your profile, it will appear here first." />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {latestProjects.map((project) => (
                  <div key={project.id} className="rounded-2xl border border-line px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{project.name}</p>
                        <p className="text-xs text-muted">{formatDate(project.assignedAt)}</p>
                      </div>
                      <ProjectStatusBadge status={project.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="font-display text-2xl">Recent activity</h2>
            {activity.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No activity yet." />
              </div>
            ) : (
              <ul className="mt-4 space-y-4">
                {activity.map((item) => (
                  <li key={item.id}>
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    <p className="text-sm text-ink-soft">{item.detail}</p>
                    <p className="mt-1 text-xs text-muted">{formatDate(item.occurredAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

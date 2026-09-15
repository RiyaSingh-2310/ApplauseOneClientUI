import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, ClipboardList, Coins, Gift, Sparkles } from 'lucide-react'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { paths } from '@/config/paths'
import { useAuth } from '@/hooks/useAuth'
import { useAsync } from '@/hooks/useAsync'
import { useMotionConfig } from '@/lib/motion'
import { getSurveyAction } from '@/lib/projects'
import { formatDate, formatNumber, givenName } from '@/lib/utils'
import { panelistService } from '@/services/panelist.service'
import type { AssignedProject } from '@/types/project'

export function DashboardPage() {
  const { user } = useAuth()
  const { duration } = useMotionConfig()
  const { data, loading, error, reload } = useAsync(() => panelistService.getDashboard())

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <LoadingSkeleton rows={5} />
      </div>
    )
  }
  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={reload} />
      </div>
    )
  }
  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState title="Your member area is unavailable right now." />
      </div>
    )
  }

  const { summary, activity, latestProjects } = data
  const remaining = Math.max(0, summary.nextRewardAt - summary.availablePoints)
  const progress = Math.min(100, Math.round((summary.availablePoints / summary.nextRewardAt) * 100) || 0)
  const readyToRedeem = summary.availablePoints >= summary.nextRewardAt
  const onboardingIncomplete = Boolean(user && !user.onboarding_completed_at)
  const featuredSurvey = latestProjects[0]

  const snapshot = [
    { label: 'Available points', value: formatNumber(summary.availablePoints), icon: Coins, tone: 'bg-gold-soft text-gold-deep' },
    { label: 'Open surveys', value: formatNumber(summary.assignedProjects), icon: ClipboardList, tone: 'bg-teal-soft text-teal-deep' },
    { label: 'This month', value: formatNumber(summary.pointsThisMonth), icon: Sparkles, tone: 'bg-info-soft text-info' },
    { label: 'Pending rewards', value: formatNumber(summary.pendingRequests), icon: Gift, tone: 'bg-warning-soft text-warning' },
  ]

  return (
    <div>
      <section className="hero-grid relative overflow-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration }}
        >
          <Badge tone="gold">Member dashboard</Badge>
          <h1 className="font-display mt-4 max-w-3xl text-3xl leading-[1.1] text-ink sm:text-5xl">
            Welcome back, {givenName(user?.name)}.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft sm:mt-4 sm:text-lg sm:leading-8">
            Track points, open assigned studies, and redeem rewards in one place.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {snapshot.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/70 bg-white/80 p-3 shadow-soft sm:p-4">
                <span className={`grid size-9 place-items-center rounded-xl ${item.tone}`}>
                  <item.icon className="size-4" />
                </span>
                <p className="font-display mt-3 text-2xl text-ink sm:text-3xl">{item.value}</p>
                <p className="mt-1 text-[11px] leading-4 text-muted sm:text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-10 lg:px-8">
        {onboardingIncomplete ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-gold/30 bg-gold-soft px-4 py-4 text-sm text-gold-deep sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p>Finish your profile so we can match you with the most relevant studies.</p>
            <Button asChild size="sm" variant="gold" className="w-full sm:w-auto">
              <Link to={paths.settings}>Complete profile</Link>
            </Button>
          </div>
        ) : null}

        <AnimatedSection className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.75rem] border border-white/70 bg-ink p-5 text-cream shadow-lift sm:p-7">
            <p className="text-xs tracking-[0.18em] text-gold uppercase">Available points</p>
            <p className="font-display mt-3 text-5xl sm:text-6xl">
              <AnimatedCounter value={summary.availablePoints} />
            </p>
            <p className="mt-2 text-sm text-cream/70">
              {readyToRedeem
                ? 'You have reached the current redemption minimum.'
                : `${formatNumber(remaining)} points until the current ${formatNumber(summary.nextRewardAt)}-point minimum.`}
            </p>
            <Progress className="mt-6 bg-white/10" value={progress} />
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/8 px-3 py-3">
                <dt className="text-[11px] text-cream/55">Redeemed</dt>
                <dd className="mt-1 font-medium">{formatNumber(summary.redeemedPoints)}</dd>
              </div>
              <div className="rounded-2xl bg-white/8 px-3 py-3">
                <dt className="text-[11px] text-cream/55">Minimum</dt>
                <dd className="mt-1 font-medium">{formatNumber(summary.nextRewardAt)}</dd>
              </div>
            </dl>
            <Button asChild className="mt-6 w-full sm:w-auto" variant="gold">
              <Link to={paths.rewards}>
                Browse Rewards
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="flex h-full flex-col pt-6">
              <p className="text-xs tracking-[0.16em] text-muted uppercase">Next study</p>
              {featuredSurvey ? (
                <>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <ProjectStatusBadge status={featuredSurvey.status} />
                    {featuredSurvey.estimatedMinutes ? (
                      <span className="text-xs text-muted">{featuredSurvey.estimatedMinutes} min</span>
                    ) : null}
                  </div>
                  <h2 className="font-display mt-3 text-2xl text-ink sm:text-3xl">{featuredSurvey.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{featuredSurvey.description}</p>
                  {featuredSurvey.points ? (
                    <p className="mt-3 text-sm font-medium text-teal">{formatNumber(featuredSurvey.points)} points</p>
                  ) : null}
                  <SurveyAction project={featuredSurvey} className="mt-5 w-full" />
                </>
              ) : (
                <EmptyState
                  title="No survey waiting."
                  description="When a study is matched to your profile, it will appear here."
                />
              )}
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.04}>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Surveys</h2>
              <p className="mt-1 text-sm text-ink-soft">Opportunities assigned to your profile appear here.</p>
            </div>
            <Link to={paths.surveys} className="text-sm font-medium text-teal hover:underline">
              See all
            </Link>
          </div>
          {latestProjects.length === 0 ? (
            <EmptyState
              title="No surveys assigned yet."
              description="When a study is matched to your profile, it will show up here with a clear way to start."
            />
          ) : (
            <div className="grid gap-4">
              {latestProjects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <ProjectStatusBadge status={project.status} />
                        {project.estimatedMinutes ? (
                          <span className="text-xs text-muted">{project.estimatedMinutes} min</span>
                        ) : null}
                      </div>
                      <h3 className="font-display mt-2 text-xl text-ink sm:text-2xl">{project.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-ink-soft">{project.description}</p>
                      {project.points ? (
                        <p className="mt-2 text-sm font-medium text-teal">{formatNumber(project.points)} points</p>
                      ) : null}
                    </div>
                    <SurveyAction project={project} className="w-full shrink-0 sm:w-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </AnimatedSection>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <AnimatedSection delay={0.06}>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Recent activity</h2>
            <p className="mt-1 text-sm text-ink-soft">A quick look at points and reward updates.</p>
            {activity.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No activity yet." description="Completed studies and reward requests will appear here." />
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {activity.map((item) => (
                  <li key={item.id} className="rounded-2xl border border-line/80 bg-white px-4 py-4 shadow-card">
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">{item.detail}</p>
                    <p className="mt-1 text-xs text-muted">{formatDate(item.occurredAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Quick actions</h2>
            <p className="mt-1 mb-5 text-sm text-ink-soft">Move through your member area without extra menus.</p>
            <QuickActions />
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

function SurveyAction({ project, className }: { project: AssignedProject; className?: string }) {
  const action = getSurveyAction(project)
  if (action.href && !action.disabled) {
    return (
      <Button asChild className={className}>
        <a href={action.href} target="_blank" rel="noreferrer">
          {action.label}
        </a>
      </Button>
    )
  }
  return (
    <Button className={className} disabled>
      {action.label}
    </Button>
  )
}

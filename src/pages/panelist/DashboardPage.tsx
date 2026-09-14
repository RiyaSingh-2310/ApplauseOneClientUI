import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
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

  return (
    <div>
      <section className="hero-grid relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration }}
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-teal uppercase">Welcome back</p>
          <h1 className="font-display mt-3 text-4xl text-ink sm:text-5xl">
            {givenName(user?.name)}, your member area is ready.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-ink-soft sm:text-lg">
            View available opportunities, track your rewards, and manage your profile — all in the same Applause One
            experience.
          </p>
        </motion.div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {onboardingIncomplete ? (
          <div className="rounded-2xl border border-gold/30 bg-gold-soft px-5 py-4 text-sm text-gold-deep">
            Finish your profile so we can match you with the most relevant studies.{' '}
            <Link to={paths.settings} className="font-medium underline">
              Complete profile
            </Link>
          </div>
        ) : null}

        <AnimatedSection className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs tracking-[0.16em] text-muted uppercase">Available points</p>
              <p className="font-display mt-3 text-5xl text-ink">
                <AnimatedCounter value={summary.availablePoints} />
              </p>
              <p className="mt-2 text-sm text-ink-soft">Ready to redeem when a reward’s minimum is met.</p>
              <Button asChild className="mt-6">
                <Link to={paths.rewards}>Browse Rewards</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-display text-2xl text-ink">Reward progress</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {readyToRedeem
                  ? `You have reached the current ${formatNumber(summary.nextRewardAt)}-point redemption minimum.`
                  : `${formatNumber(remaining)} points to go until the current ${formatNumber(summary.nextRewardAt)}-point minimum.`}
              </p>
              <Progress className="mt-5" value={progress} />
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-cream px-3 py-3">
                  <dt className="text-xs text-muted">Your points</dt>
                  <dd className="mt-1 font-medium text-ink">{formatNumber(summary.availablePoints)}</dd>
                </div>
                <div className="rounded-xl bg-cream px-3 py-3">
                  <dt className="text-xs text-muted">Current minimum</dt>
                  <dd className="mt-1 font-medium text-ink">{formatNumber(summary.nextRewardAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.04}>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl text-ink">Surveys</h2>
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
              {latestProjects.map((project) => {
                const action = getSurveyAction(project)
                return (
                  <Card key={project.id}>
                    <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <ProjectStatusBadge status={project.status} />
                          {project.estimatedMinutes ? (
                            <span className="text-xs text-muted">{project.estimatedMinutes} min</span>
                          ) : null}
                        </div>
                        <h3 className="font-display mt-2 text-2xl text-ink">{project.name}</h3>
                        <p className="mt-1 text-sm leading-6 text-ink-soft">{project.description}</p>
                        {project.points ? (
                          <p className="mt-2 text-sm font-medium text-teal">{formatNumber(project.points)} points</p>
                        ) : null}
                      </div>
                      {action.href && !action.disabled ? (
                        <Button asChild className="shrink-0">
                          <a href={action.href} target="_blank" rel="noreferrer">
                            {action.label}
                          </a>
                        </Button>
                      ) : (
                        <Button className="shrink-0" disabled>
                          {action.label}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </AnimatedSection>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <AnimatedSection delay={0.06}>
            <h2 className="font-display text-3xl text-ink">Recent activity</h2>
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
            <h2 className="font-display text-3xl text-ink">Quick actions</h2>
            <p className="mt-1 mb-5 text-sm text-ink-soft">Move through your member area without extra menus.</p>
            <QuickActions />
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

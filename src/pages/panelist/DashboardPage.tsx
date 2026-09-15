import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Coins, Gift, Sparkles } from 'lucide-react'
import { ActivityList } from '@/components/dashboard/ActivityList'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { paths } from '@/config/paths'
import { useAuth } from '@/hooks/useAuth'
import { useAsync } from '@/hooks/useAsync'
import { useMotionConfig } from '@/lib/motion'
import { formatNumber, givenName } from '@/lib/utils'
import { activityFromData, composeDashboard } from '@/services/panelist.service'
import { projectService } from '@/services/project.service'
import { rewardRequestService } from '@/services/rewardRequest.service'
import { rewardService } from '@/services/reward.service'

export function DashboardPage() {
  const { user } = useAuth()
  const { duration } = useMotionConfig()
  const balanceQuery = useAsync(() => rewardService.getBalance(), 'balance')
  const transactionsQuery = useAsync(() => rewardService.getTransactions(), 'transactions')
  const requestsQuery = useAsync(() => rewardRequestService.listRecords(), 'requests')
  const projectsQuery = useAsync(() => projectService.getAssigned(), 'projects')

  const summary =
    balanceQuery.data &&
    composeDashboard(
      balanceQuery.data,
      transactionsQuery.data ?? [],
      requestsQuery.data ?? [],
      projectsQuery.data?.items ?? [],
    ).summary
  const activity = activityFromData(transactionsQuery.data ?? [], requestsQuery.data ?? [])
  const projects = projectsQuery.data?.items ?? []
  const remaining = summary ? Math.max(0, summary.nextRewardAt - summary.availablePoints) : 0
  const progress = summary
    ? Math.min(100, Math.round((summary.availablePoints / summary.nextRewardAt) * 100) || 0)
    : 0
  const readyToRedeem = Boolean(summary && summary.availablePoints >= summary.nextRewardAt)
  const onboardingIncomplete = Boolean(user && !user.onboarding_completed_at)

  const snapshot = summary
    ? [
        { label: 'Available points', value: formatNumber(summary.availablePoints), icon: Coins, tone: 'bg-gold-soft text-gold-deep' },
        { label: 'This month', value: formatNumber(summary.pointsThisMonth), icon: Sparkles, tone: 'bg-info-soft text-info' },
        { label: 'Pending rewards', value: formatNumber(summary.pendingRequests), icon: Gift, tone: 'bg-warning-soft text-warning' },
      ]
    : []

  return (
    <div>
      <section className="hero-grid relative overflow-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration }}
        >
          <Badge tone="gold">Member space</Badge>
          <h1 className="font-display mt-4 max-w-3xl text-3xl leading-[1.1] text-ink sm:text-5xl">
            Welcome back, {givenName(user?.name)}.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft sm:mt-4 sm:text-lg sm:leading-8">
            Your points, opportunities, and reward activity — kept personal and easy to follow.
          </p>
          {balanceQuery.loading ? (
            <div className="mt-8">
              <LoadingSkeleton rows={1} />
            </div>
          ) : snapshot.length ? (
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {snapshot.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-soft">
                  <span className={`grid size-9 place-items-center rounded-xl ${item.tone}`}>
                    <item.icon className="size-4" />
                  </span>
                  <p className="font-display mt-3 text-2xl text-ink sm:text-3xl">{item.value}</p>
                  <p className="mt-1 text-xs text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </motion.div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {onboardingIncomplete ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-gold/30 bg-gold-soft px-4 py-4 text-sm text-gold-deep sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p>Finish your profile so we can match you with the most relevant opportunities.</p>
            <Button asChild size="sm" variant="gold" className="w-full sm:w-auto">
              <Link to={paths.settings}>Complete profile</Link>
            </Button>
          </div>
        ) : null}

        <AnimatedSection>
          {balanceQuery.loading ? <LoadingSkeleton rows={1} /> : null}
          {balanceQuery.error ? (
            <ErrorState message="We couldn’t load your points." onRetry={balanceQuery.reload} />
          ) : null}
          {summary && !balanceQuery.loading && !balanceQuery.error ? (
            <div className="rounded-[1.75rem] border border-white/70 bg-ink p-5 text-cream shadow-lift sm:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs tracking-[0.18em] text-gold uppercase">Available points</p>
                  <p className="font-display mt-3 text-5xl sm:text-6xl">
                    <AnimatedCounter value={summary.availablePoints} />
                  </p>
                  <p className="mt-2 max-w-lg text-sm text-cream/70">
                    {readyToRedeem
                      ? `You can request a reward. The current minimum is ${formatNumber(summary.nextRewardAt)} points.`
                      : `${formatNumber(remaining)} points until the current ${formatNumber(summary.nextRewardAt)}-point minimum.`}
                  </p>
                </div>
                <Button asChild className="w-full sm:w-auto" variant="gold">
                  <Link to={paths.rewards}>
                    Choose a Reward
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
              <Progress className="mt-6 bg-white/10" value={progress} />
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-2xl bg-white/8 px-3 py-3">
                  <dt className="text-[11px] text-cream/55">Redeemed</dt>
                  <dd className="mt-1 font-medium">{formatNumber(summary.redeemedPoints)}</dd>
                </div>
                <div className="rounded-2xl bg-white/8 px-3 py-3">
                  <dt className="text-[11px] text-cream/55">Minimum</dt>
                  <dd className="mt-1 font-medium">{formatNumber(summary.nextRewardAt)}</dd>
                </div>
                <div className="col-span-2 rounded-2xl bg-white/8 px-3 py-3 sm:col-span-1">
                  <dt className="text-[11px] text-cream/55">Pending requests</dt>
                  <dd className="mt-1 font-medium">{formatNumber(summary.pendingRequests)}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </AnimatedSection>

        <AnimatedSection delay={0.04}>
          <div className="mb-4">
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Recent projects</h2>
            <p className="mt-1 text-sm text-ink-soft">Opportunities assigned to your profile will appear here.</p>
          </div>
          {projectsQuery.loading ? <LoadingSkeleton rows={2} /> : null}
          {projectsQuery.error ? (
            <ErrorState message="We couldn’t load your projects." onRetry={projectsQuery.reload} />
          ) : null}
          {!projectsQuery.loading && !projectsQuery.error && projects.length === 0 ? (
            <EmptyState
              title="No projects assigned yet."
              description="When a research opportunity is matched to your profile, it will show up here."
            />
          ) : null}
          {!projectsQuery.loading && !projectsQuery.error && projects.length > 0 ? (
            <div className="grid gap-4">
              {projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : null}
        </AnimatedSection>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <AnimatedSection delay={0.06}>
            <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-2xl text-ink sm:text-3xl">Recent activity</h2>
                <p className="mt-1 text-sm text-ink-soft">Points earned and reward requests from your account.</p>
              </div>
              <Link to={paths.history} className="text-sm font-medium text-teal hover:underline">
                View History
              </Link>
            </div>
            {transactionsQuery.loading || requestsQuery.loading ? <LoadingSkeleton rows={2} /> : null}
            {transactionsQuery.error || requestsQuery.error ? (
              <div className="mt-4">
                <ErrorState
                  message="We couldn’t load your activity."
                  onRetry={() => {
                    transactionsQuery.reload()
                    requestsQuery.reload()
                  }}
                />
              </div>
            ) : null}
            {!transactionsQuery.loading &&
            !requestsQuery.loading &&
            !transactionsQuery.error &&
            !requestsQuery.error &&
            activity.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  title="No recent activity yet."
                  description="Completed opportunities and reward requests will appear here as they happen."
                />
              </div>
            ) : null}
            {!transactionsQuery.loading &&
            !requestsQuery.loading &&
            !transactionsQuery.error &&
            !requestsQuery.error &&
            activity.length > 0 ? (
              <ActivityList items={activity} />
            ) : null}
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <div className="rounded-[1.6rem] border border-teal/15 bg-teal-soft/40 p-5 sm:p-6">
              <p className="text-xs tracking-[0.16em] text-teal-deep uppercase">Redeem your points</p>
              <h2 className="font-display mt-2 text-2xl text-ink">Use your balance for a reward.</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Choose a payout option, submit a request, then follow its status in History.
              </p>
              <Button asChild className="mt-5 w-full sm:w-auto">
                <Link to={paths.rewards}>View Rewards</Link>
              </Button>
            </div>
            <h2 className="font-display mt-8 text-2xl text-ink">Quick actions</h2>
            <p className="mt-1 mb-5 text-sm text-ink-soft">Move through your member area without extra menus.</p>
            <QuickActions />
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { RewardCard } from '@/components/shared/RewardCard'
import { categoryLabels } from '@/content/rewards'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useAsync } from '@/hooks/useAsync'
import { formatNumber } from '@/lib/utils'
import { panelistService } from '@/services/panelist.service'
import { rewardService } from '@/services/reward.service'
import { ApiRequestError } from '@/services/errors'
import type { RewardCategory } from '@/types/common'
import type { RewardOption } from '@/types/reward'

const filters: Array<{ id: 'all' | RewardCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'cash', label: 'Cash' },
  { id: 'gift-card', label: 'Gift Cards' },
  { id: 'digital', label: 'Digital' },
  { id: 'charity', label: 'Charity' },
]

export function PanelistRewardsPage() {
  const catalog = useAsync(() => rewardService.getCatalog())
  const dashboard = useAsync(() => panelistService.getDashboard())
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const [selected, setSelected] = useState<RewardOption | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const items = useMemo(() => {
    const list = catalog.data?.items ?? []
    if (filter === 'all') return list
    return list.filter((item) => item.category === filter)
  }, [catalog.data, filter])

  const points = dashboard.data?.summary.availablePoints ?? 0
  const minimum = catalog.data?.guide.minimumRedemption ?? 0

  async function confirmRedeem() {
    if (!selected) return
    setSubmitting(true)
    setErrorMessage('')
    try {
      await rewardService.redeem({ rewardId: selected.id })
      setMessage(`${selected.name} request submitted.`)
      setSelected(null)
      catalog.reload()
      dashboard.reload()
    } catch (error) {
      setErrorMessage(error instanceof ApiRequestError ? error.message : 'Unable to submit this request.')
    } finally {
      setSubmitting(false)
    }
  }

  if (catalog.loading || dashboard.loading) return <LoadingSkeleton rows={4} />
  if (catalog.error) return <ErrorState message="Unable to load rewards. Please try again." onRetry={catalog.reload} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-ink">Rewards</h1>
        <p className="mt-2 text-ink-soft">Choose an option and submit a redemption request. Point requirements are set per reward.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Current points</p>
            <p className="font-display mt-2 text-4xl">{formatNumber(points)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Typical minimum</p>
            <p className="font-display mt-2 text-4xl">{formatNumber(minimum)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Categories</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{Object.values(categoryLabels).join(' · ')}</p>
          </CardContent>
        </Card>
      </div>

      {message ? <p className="rounded-xl bg-success-soft px-4 py-3 text-sm text-success">{message}</p> : null}

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full px-4 py-2 text-sm ${filter === item.id ? 'bg-ink text-cream' : 'bg-white text-ink-soft'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState title="No rewards in this category yet." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              action={
                <Button
                  className="w-full"
                  disabled={!reward.available || points < reward.pointsRequired}
                  onClick={() => {
                    setErrorMessage('')
                    setSelected(reward)
                  }}
                >
                  {!reward.available
                    ? 'Unavailable'
                    : points < reward.pointsRequired
                      ? 'Not enough points'
                      : 'Redeem'}
                </Button>
              }
            />
          ))}
        </div>
      )}

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent
          title="Confirm Reward Redemption"
          description={selected ? `Review this redemption before you submit.` : undefined}
        >
          {errorMessage ? (
            <p className="mb-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
              {errorMessage}
            </p>
          ) : null}
          {selected ? (
            <dl className="grid gap-3 rounded-2xl border border-line bg-white px-4 py-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Reward</dt>
                <dd className="font-medium text-ink">{selected.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Points required</dt>
                <dd className="font-medium text-ink">{formatNumber(selected.pointsRequired)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Current balance</dt>
                <dd className="font-medium text-ink">{formatNumber(points)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Remaining balance</dt>
                <dd className="font-medium text-ink">{formatNumber(points - selected.pointsRequired)}</dd>
              </div>
            </dl>
          ) : null}
          <p className="mt-4 text-sm leading-6 text-ink-soft">
            This creates a pending request. You can track status under Reward Requests.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button onClick={confirmRedeem} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Confirm Redemption'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

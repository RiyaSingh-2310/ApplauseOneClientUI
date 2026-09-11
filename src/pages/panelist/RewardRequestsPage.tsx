import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { RequestStatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import { useAsync } from '@/hooks/useAsync'
import { formatDate, formatNumber } from '@/lib/utils'
import { rewardRequestService } from '@/services/rewardRequest.service'
import { categoryLabels } from '@/content/rewards'

export function RewardRequestsPage() {
  const { data, loading, error, reload } = useAsync(() => rewardRequestService.list())

  if (loading) return <LoadingSkeleton rows={4} />
  if (error) return <ErrorState message={error} onRetry={reload} />

  const items = data?.items ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-ink">Reward requests</h1>
        <p className="mt-2 text-ink-soft">Track every redemption from pending through completed.</p>
      </div>
      {items.length === 0 ? (
        <EmptyState title="No reward requests yet." description="When you redeem a catalog item, the request will appear here." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs tracking-[0.14em] text-muted uppercase">{categoryLabels[item.category]}</p>
                  <h2 className="font-display text-2xl text-ink">{item.rewardName}</h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    {formatNumber(item.pointsUsed)} points · {formatDate(item.requestedAt)}
                  </p>
                </div>
                <RequestStatusBadge status={item.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

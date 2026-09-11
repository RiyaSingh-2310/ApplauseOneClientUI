import { useState } from 'react'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { RequestStatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAsync } from '@/hooks/useAsync'
import { formatDate, formatNumber } from '@/lib/utils'
import { rewardRequestService } from '@/services/rewardRequest.service'

const statusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
  { value: 'posted', label: 'Posted' },
]

const typeOptions = [
  { value: 'all', label: 'All types' },
  { value: 'earned', label: 'Earned' },
  { value: 'redeemed', label: 'Redeemed' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'adjustment', label: 'Adjustment' },
]

export function RewardHistoryPage() {
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const { data, loading, error, reload } = useAsync(
    () => rewardRequestService.history({ status, type, from, to }),
    `${status}|${type}|${from}|${to}`,
  )

  if (loading) return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-ink">Reward history</h1>
      <LoadingSkeleton rows={4} />
    </div>
  )
  if (error) return <ErrorState message={error} onRetry={reload} />

  const items = data?.items ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-ink">Reward history</h1>
        <p className="mt-2 text-ink-soft">Filter previous point movements by date, status, and type.</p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select value={status} options={statusOptions} onChange={(event) => setStatus(event.target.value)} />
        <Select value={type} options={typeOptions} onChange={(event) => setType(event.target.value)} />
        <Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} aria-label="From date" />
        <Input type="date" value={to} onChange={(event) => setTo(event.target.value)} aria-label="To date" />
      </div>

      {items.length === 0 ? (
        <EmptyState title="No transactions match these filters." description="Try clearing a filter or widening the date range." />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-line bg-white md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line text-xs tracking-[0.12em] text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Reward</th>
                  <th className="px-4 py-3 font-medium">Points</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-line/70 last:border-0">
                    <td className="px-4 py-4 font-medium text-ink">{item.rewardName}</td>
                    <td className="px-4 py-4">{formatNumber(item.points)}</td>
                    <td className="px-4 py-4">{formatDate(item.occurredAt)}</td>
                    <td className="px-4 py-4 capitalize">{item.type}</td>
                    <td className="px-4 py-4">
                      <RequestStatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:hidden">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-medium text-ink">{item.rewardName}</h2>
                    <RequestStatusBadge status={item.status} />
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">
                    {formatNumber(item.points)} points · {formatDate(item.occurredAt)} · {item.type}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

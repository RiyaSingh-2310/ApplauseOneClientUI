import { Badge } from '@/components/ui/badge'
import type { ProjectStatus, RewardRequestStatus } from '@/types/common'

const projectTone = {
  new: 'info',
  'in-progress': 'warning',
  completed: 'success',
  expired: 'muted',
  closed: 'muted',
} as const

const requestTone = {
  pending: 'warning',
  approved: 'info',
  rejected: 'danger',
  completed: 'success',
  posted: 'default',
} as const

const labels: Record<string, string> = {
  new: 'New',
  'in-progress': 'In progress',
  completed: 'Completed',
  expired: 'Expired',
  closed: 'Closed',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  posted: 'Posted',
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge tone={projectTone[status]}>{labels[status]}</Badge>
}

export function RequestStatusBadge({ status }: { status: RewardRequestStatus | 'posted' }) {
  return <Badge tone={requestTone[status]}>{labels[status]}</Badge>
}

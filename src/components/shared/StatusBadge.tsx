import { Badge } from '@/components/ui/badge'
import type { ProjectStatus } from '@/types/common'

const projectTone = {
  new: 'info',
  'in-progress': 'warning',
  completed: 'success',
  expired: 'muted',
  closed: 'muted',
} as const

const requestTone: Record<string, 'warning' | 'info' | 'danger' | 'success' | 'default' | 'muted'> = {
  pending: 'warning',
  approved: 'info',
  rejected: 'danger',
  completed: 'success',
  posted: 'default',
}

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
  return <Badge tone={projectTone[status]}>{labels[status] ?? status}</Badge>
}

export function RequestStatusBadge({ status }: { status: string }) {
  return <Badge tone={requestTone[status] ?? 'default'}>{labels[status] ?? status}</Badge>
}

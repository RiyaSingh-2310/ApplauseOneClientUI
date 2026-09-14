import { ExternalLink } from 'lucide-react'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAsync } from '@/hooks/useAsync'
import { getSurveyAction } from '@/lib/projects'
import { formatDate, formatNumber } from '@/lib/utils'
import { projectService } from '@/services/project.service'
import type { AssignedProject } from '@/types/project'

export function ProjectsPage() {
  const { data, loading, error, reload } = useAsync(() => projectService.getAssigned({ sort: 'assignedAt:desc' }))

  if (loading) return <LoadingSkeleton rows={4} />
  if (error) return <ErrorState message={error} onRetry={reload} />

  const items = data?.items ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-ink">Assigned projects</h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Every study assigned to you lives here, newest first. Open a survey from the portal instead of waiting on email.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No projects assigned yet."
          description="Assigned studies will appear here when the panel provides them for your profile."
        />
      ) : (
        <div className="space-y-4">
          {items.map((project, index) => (
            <Card key={project.id}>
              <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {index === 0 ? (
                      <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-semibold tracking-wide text-gold-deep uppercase">
                        Latest
                      </span>
                    ) : null}
                    <ProjectStatusBadge status={project.status} />
                  </div>
                  <h2 className="font-display mt-2 text-2xl text-ink">{project.name}</h2>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">{project.description}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <dt className="text-xs text-muted">Assigned</dt>
                      <dd className="mt-1 font-medium">{formatDate(project.assignedAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Points</dt>
                      <dd className="mt-1 font-medium">{project.points ? formatNumber(project.points) : '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Time</dt>
                      <dd className="mt-1 font-medium">{project.estimatedMinutes} min</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs text-muted">Survey</dt>
                      <dd className="mt-1 truncate font-medium text-teal">
                        {project.surveyUrl ? 'Ready in portal' : 'Link not provided'}
                      </dd>
                    </div>
                  </dl>
                </div>
                <SurveyAction project={project} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function SurveyAction({ project }: { project: AssignedProject }) {
  const action = getSurveyAction(project)

  if (action.disabled || !action.href) {
    return (
      <Button className="shrink-0" disabled>
        {action.label}
        <ExternalLink />
      </Button>
    )
  }

  return (
    <Button asChild className="shrink-0">
      <a href={action.href} target="_blank" rel="noreferrer">
        {action.label}
        <ExternalLink />
      </a>
    </Button>
  )
}


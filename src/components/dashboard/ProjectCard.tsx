import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cardLiftClass } from '@/lib/motion'
import { getProjectAction } from '@/lib/projects'
import { cn, formatDate, formatNumber } from '@/lib/utils'
import type { AssignedProject } from '@/types/project'

export function ProjectCard({ project }: { project: AssignedProject }) {
  const action = getProjectAction(project)

  return (
    <Card className={cn(cardLiftClass)}>
      <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">Opportunity</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ProjectStatusBadge status={project.status} />
            {project.assignedAt ? <span className="text-xs text-muted">{formatDate(project.assignedAt)}</span> : null}
          </div>
          <h3 className="font-display mt-2 text-xl text-ink sm:text-2xl">{project.name}</h3>
          {project.description ? <p className="mt-1 text-sm leading-6 text-ink-soft">{project.description}</p> : null}
          {project.points ? (
            <p className="mt-2 text-sm font-medium text-teal">{formatNumber(project.points)} points</p>
          ) : null}
        </div>
        {action.href && !action.disabled ? (
          <Button asChild className="w-full shrink-0 sm:w-auto">
            <a href={action.href} target="_blank" rel="noreferrer">
              {action.label}
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}

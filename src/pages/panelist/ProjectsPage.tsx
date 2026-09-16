import { useEffect } from 'react'
import { AssignedSurveyCard } from '@/components/surveys/AssignedSurveyCard'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/shared/PageState'
import { useAsync } from '@/hooks/useAsync'
import { projectService } from '@/services/project.service'

export function ProjectsPage() {
  const { data, loading, error, reload } = useAsync(() => projectService.getAssigned({ sort: 'assignedAt:desc' }), 'assigned-surveys')

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') reload()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [reload])

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <LoadingSkeleton rows={4} />
      </div>
    )
  }
  if (error && !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={reload} />
      </div>
    )
  }

  const items = data?.items ?? []

  return (
    <div>
      <section className="hero-grid px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-teal uppercase">Assigned to you</p>
          <h1 className="font-display mt-3 text-4xl text-ink sm:text-5xl">Surveys</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-ink-soft">
            Studies assigned to your account appear here after an administrator assigns them. No email invitation is required.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {items.length === 0 && !error ? (
          <EmptyState
            title="No surveys assigned yet"
            description="When an administrator assigns a survey to your account, it will show up here so you can start it from this page."
          />
        ) : (
          <div className="space-y-4">
            {items.map((project, index) => (
              <AssignedSurveyCard key={project.id} project={project} latest={index === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

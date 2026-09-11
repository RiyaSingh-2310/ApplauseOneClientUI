import type { AssignedProject } from '@/types/project'

export function getSurveyAction(project: AssignedProject) {
  if (project.status === 'completed') {
    return { disabled: true, label: 'Already completed' }
  }
  if (project.status === 'expired' || project.status === 'closed') {
    return { disabled: true, label: project.status === 'closed' ? 'Project closed' : 'Assignment expired' }
  }
  if (!project.surveyUrl) {
    return { disabled: true, label: 'Survey unavailable' }
  }
  return { disabled: false, label: 'Open survey', href: project.surveyUrl }
}

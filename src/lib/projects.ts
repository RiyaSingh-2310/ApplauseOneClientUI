import type { AssignedProject } from '@/types/project'

export function getProjectAction(project: AssignedProject) {
  if (project.status === 'completed') {
    return { disabled: true, label: 'Completed' }
  }
  if (project.status === 'expired' || project.status === 'closed') {
    return { disabled: true, label: project.status === 'closed' ? 'Closed' : 'Expired' }
  }
  if (project.surveyUrl) {
    return { disabled: false, label: 'View details', href: project.surveyUrl }
  }
  return { disabled: true, label: 'View details' }
}

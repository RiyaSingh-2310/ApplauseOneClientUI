import type { AssignedProject } from '@/types/project'

export function getProjectAction(project: AssignedProject) {
  if (project.status === 'complete') {
    return { disabled: true, label: 'Completed' }
  }
  if (project.status === 'terminate') {
    return { disabled: true, label: 'Terminate' }
  }
  if (project.status === 'quota_full') {
    return { disabled: true, label: 'Quota full' }
  }
  if (project.surveyUrl) {
    return { disabled: false, label: 'Start Survey', href: project.surveyUrl }
  }
  return { disabled: true, label: 'Start Survey' }
}

export function rewardStatusLabel(status: AssignedProject['rewardStatus']) {
  return status === 'credited' ? 'Credited' : 'Pending'
}

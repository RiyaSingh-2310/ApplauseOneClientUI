import { unwrapCollection } from '@/lib/apiMap'
import { asNumber, parseApiDate } from '@/lib/utils'
import type { SurveyAssignment, SurveyAssignmentStatus } from '@/types/api'
import type { PaginatedResponse } from '@/types/common'
import type { AssignedProject, ProjectQuery } from '@/types/project'
import { ApiRequestError, apiRequest } from './http'

const SURVEY_STATUSES: SurveyAssignmentStatus[] = ['active', 'complete', 'terminate', 'quota_full']

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function asStatus(value: unknown): string {
  const raw = String(value ?? '').trim()
  const normalized = raw.toLowerCase().replace(/[\s-]+/g, '_')
  if (SURVEY_STATUSES.includes(normalized as SurveyAssignmentStatus)) return normalized
  return raw
}

function unwrapSurvey(payload: unknown): SurveyAssignment | null {
  if (!isRecord(payload)) return null
  if ('id' in payload && ('status' in payload || 'survey_name' in payload || 'survey_url' in payload)) {
    return payload as unknown as SurveyAssignment
  }
  for (const key of ['survey', 'assignment', 'item']) {
    const inner = payload[key]
    if (isRecord(inner) && 'id' in inner) return inner as unknown as SurveyAssignment
  }
  return null
}

function resolveSurveyUrl(url: string | null | undefined, panelistId: number | null) {
  if (!url) return null
  if (panelistId == null) return url
  return url.replaceAll('{panelist_id}', String(panelistId))
}

export function mapSurveyAssignment(record: SurveyAssignment): AssignedProject {
  const panelistId = asNumber(record.panelist_id) || null
  const status = asStatus(record.status)
  return {
    id: String(record.id),
    name: record.survey_name?.trim() || 'Survey',
    description: record.remark?.trim() || '',
    assignedAt: record.created_at,
    status,
    points: record.reward_points == null ? null : asNumber(record.reward_points),
    surveyUrl: resolveSurveyUrl(record.survey_url, panelistId),
    completedAt: record.completed_at,
    // Backend credits points when Admin marks the assignment complete. There is no separate reward_status field.
    rewardStatus: status === 'complete' ? 'credited' : 'pending',
  }
}

function unwrapSurveyList(payload: unknown): SurveyAssignment[] {
  const items = unwrapCollection<SurveyAssignment>(payload, ['items', 'surveys', 'assignments', 'data'])
  return items.filter((item) => isRecord(item) && 'id' in item)
}

function listTotal(payload: unknown, items: SurveyAssignment[]) {
  if (isRecord(payload) && payload.total != null) return asNumber(payload.total)
  return items.length
}

function sortAssignments(items: AssignedProject[], sort: ProjectQuery['sort']) {
  const next = [...items]
  next.sort((a, b) => parseApiDate(a.assignedAt).getTime() - parseApiDate(b.assignedAt).getTime())
  if (sort !== 'assignedAt:asc') next.reverse()
  return next
}

function queryString(query: ProjectQuery) {
  const params = new URLSearchParams()
  if (query.status) params.set('status', query.status)
  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  const suffix = params.toString()
  return suffix ? `?${suffix}` : ''
}

export const surveyService = {
  async list(query: ProjectQuery = {}): Promise<PaginatedResponse<AssignedProject>> {
    const data = await apiRequest<unknown>(`/surveys${queryString({ page: query.page ?? 1, limit: query.limit ?? 100, status: query.status })}`)
    const records = unwrapSurveyList(data)
    const items = sortAssignments(records.map(mapSurveyAssignment), query.sort ?? 'assignedAt:desc')
    return { items, total: listTotal(data, records) }
  },
  async getById(id: string | number): Promise<AssignedProject> {
    const data = await apiRequest<unknown>(`/surveys/${encodeURIComponent(String(id))}`)
    const record = unwrapSurvey(data)
    if (!record) {
      throw new ApiRequestError({ message: 'We could not find that survey assignment.' }, 404)
    }
    return mapSurveyAssignment(record)
  },
}

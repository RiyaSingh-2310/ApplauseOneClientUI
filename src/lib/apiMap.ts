import type {
  DropdownOption,
  OnboardingAnswer,
  OnboardingAnswerInput,
  OnboardingQuestion,
  OnboardingStepGroup,
  PaymentMethod,
  PublicSettings,
  RewardRequestRecord,
  RewardTransactionRecord,
} from '@/types/api'
import type { RewardCategory, RewardRequestStatus, TransactionType } from '@/types/common'
import type { RewardOption, RewardRequest, RewardTransaction } from '@/types/reward'
import { asNumber } from './utils'

export function flattenQuestions(steps: OnboardingStepGroup[]) {
  return steps.flatMap((step) =>
    step.questions.map((question) => ({
      ...question,
      id: asNumber(question.id),
      step_no: asNumber(question.step_no),
      is_required: asNumber(question.is_required),
      options: (question.options ?? []).map((option) => ({
        id: asNumber(option.id),
        name: option.name,
      })),
    })),
  )
}

export function questionsForApiStep(steps: OnboardingStepGroup[], stepNo: number) {
  return flattenQuestions(steps).filter((question) => question.step_no === stepNo)
}

export function optionLabelById(options: DropdownOption[], id: string | number) {
  return options.find((option) => String(option.id) === String(id))?.name ?? String(id)
}

export function findYesNoId(question: OnboardingQuestion, yes: boolean) {
  const wanted = yes ? 'yes' : 'no'
  return question.options.find((option) => option.name.trim().toLowerCase() === wanted)?.id
}

export function answersToValues(answers: OnboardingAnswer[]) {
  const values: Record<string, string | string[]> = {}
  for (const answer of answers) {
    const key = String(answer.question_id)
    const ref = String(answer.answer_ref_id ?? '')
    if (!ref) continue
    if (answer.field_type === 'checkbox') {
      const current = values[key]
      values[key] = Array.isArray(current) ? [...current, ref] : [ref]
    } else {
      values[key] = ref
    }
  }
  return values
}

export function displayAnswer(answers: OnboardingAnswer[], questionId: number) {
  const matched = answers.filter((answer) => asNumber(answer.question_id) === questionId)
  if (!matched.length) return ''
  return matched.map((answer) => answer.answer_text).filter(Boolean).join(', ')
}

export function buildOnboardingPayload(
  questions: OnboardingQuestion[],
  values: Record<string, string | string[]>,
  consents: { acceptTerms: boolean; acceptPrivacy: boolean; emailInvitations: boolean },
): OnboardingAnswerInput[] {
  const payload: OnboardingAnswerInput[] = []

  for (const question of questions) {
    if (question.step_no === 5) {
      const yes = question.id === 11 ? consents.emailInvitations : question.id === 10 ? consents.acceptPrivacy : consents.acceptTerms
      const optionId = findYesNoId(question, yes)
      if (optionId != null) payload.push({ question_id: question.id, answer_ref_id: optionId })
      continue
    }

    const value = values[String(question.id)]
    if (question.field_type === 'checkbox') {
      const ids = Array.isArray(value) ? value.map((item) => asNumber(item)).filter(Boolean) : []
      if (ids.length) payload.push({ question_id: question.id, answer_ref_ids: ids })
      continue
    }

    const id = typeof value === 'string' ? asNumber(value) : 0
    if (id) payload.push({ question_id: question.id, answer_ref_id: id })
  }

  return payload
}

export function unwrapCollection<T>(payload: unknown, keys: string[]): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (!payload || typeof payload !== 'object') return []
  const record = payload as Record<string, unknown>
  for (const key of keys) {
    const value = record[key]
    if (Array.isArray(value)) return value as T[]
  }
  return []
}

export function paymentMethodName(record: RewardRequestRecord) {
  return record.payment_method || record.payment_methord || 'Reward'
}

export function paymentMethodCategory(name: string): RewardCategory {
  const value = name.toLowerCase()
  if (value.includes('paypal') || value === 'cash') return 'cash'
  if (value.includes('gift') || value.includes('amazon') || value.includes('flipkart')) return 'gift-card'
  if (value.includes('charity') || value.includes('donate')) return 'charity'
  return 'digital'
}

const accents: Record<RewardCategory, string> = {
  cash: '#0f6e6a',
  'gift-card': '#c4a35a',
  digital: '#3d5a80',
  charity: '#2a9d8f',
}

export function paymentMethodsToRewards(methods: PaymentMethod[], minimumPayout: number): RewardOption[] {
  return methods.map((method) => {
    const category = paymentMethodCategory(method.name)
    return {
      id: String(method.id),
      name: method.name,
      category,
      description: `Redeem points via ${method.name}. Requests are reviewed before payout.`,
      pointsRequired: minimumPayout,
      delivery: category === 'cash' ? 'After approval' : 'Processed after review',
      available: true,
      popular: method.name.toLowerCase() === 'paypal',
      accent: accents[category],
      logoLabel: method.name.slice(0, 2).toUpperCase(),
      estimatedValueLabel: `${minimumPayout}+ points`,
    }
  })
}

export function settingsToRewards(settings: PublicSettings) {
  return paymentMethodsToRewards(settings.payment_methods ?? [], asNumber(settings.minimum_payout))
}

export function mapRewardRequest(record: RewardRequestRecord): RewardRequest {
  const name = paymentMethodName(record)
  const status = (record.status || 'pending') as RewardRequestStatus
  return {
    id: String(record.id),
    rewardId: name,
    rewardName: name,
    category: paymentMethodCategory(name),
    pointsUsed: asNumber(record.reward_points),
    requestedAt: record.created_at,
    status,
    paymentMethod: record.payment_method || record.payment_methord || name,
    remark: record.remark,
    comment: record.comment,
    processedAt: record.action_date,
  }
}

export function mapTransaction(record: RewardTransactionRecord): RewardTransaction {
  const points = asNumber(record.reward_points)
  const type: TransactionType =
    record.transaction_type === 'debit'
      ? 'redeemed'
      : record.reward_type === 'registration' || record.reward_type === 'manual'
        ? 'bonus'
        : 'earned'
  const status = (record.status || 'posted') as RewardTransaction['status']
  return {
    id: String(record.id),
    rewardName: record.remark || record.reward_type || 'Points',
    points,
    occurredAt: record.created_at,
    type,
    status,
    category: record.reward_type === 'payout' ? paymentMethodCategory(record.remark ?? '') : undefined,
  }
}

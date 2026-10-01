import {
  accountAnswerCategories,
  API_STEP_SECTIONS,
  consentBindings,
  PROFESSIONAL_EMPLOYMENT_VALUES,
  profileFieldSpecs,
  type ConsentField,
  type ProfileFieldSpec,
  type ProfileFieldType,
  type ProfileSectionId,
} from '@/content/profileQuestions'
import type { OnboardingAnswer, OnboardingAnswerInput, OnboardingQuestion, OnboardingStepGroup } from '@/types/api'
import { findYesNoId, flattenQuestions } from './apiMap'
import { asNumber } from './utils'

export type AnswerValue = string | string[]
export type AnswerValues = Record<string, AnswerValue>

export interface FormOption {
  value: string
  label: string
  exclusive?: boolean
}

export interface FormQuestion {
  /** Key in the answers map and in validation errors (`q-${key}`). */
  key: string
  section: ProfileSectionId
  label: string
  hint?: string
  fieldType: ProfileFieldType
  required: boolean
  options: FormOption[]
  placeholder?: string
  maxLength?: number
  /** Backend question that stores the answer; missing until the backend defines it. */
  api?: OnboardingQuestion
  spec?: ProfileFieldSpec
  /** `api`: values are backend option ids. `spec`: values are spec option values, resolved on submit. */
  optionSource: 'api' | 'spec'
}

export type ProfileSections = Record<ProfileSectionId, FormQuestion[]>

export interface BuiltAnswers {
  answers: OnboardingAnswerInput[]
  /** Labels of answered fields the backend cannot store yet. */
  unmapped: string[]
}

const ANSWER_TEXT_MAX = 255
const TEXT_SEPARATOR = ' | '

export function normalizeLabel(value: string) {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '')
}

function toFieldType(value: string | undefined): ProfileFieldType {
  if (value === 'dropdown' || value === 'checkbox' || value === 'text') return value
  return 'radio'
}

function fromApi(question: OnboardingQuestion, section: ProfileSectionId): FormQuestion {
  return {
    key: String(question.id),
    section,
    label: question.question_text,
    fieldType: toFieldType(question.field_type),
    required: Boolean(asNumber(question.is_required)),
    options: question.options.map((option) => ({ value: String(option.id), label: option.name })),
    api: question,
    optionSource: 'api',
  }
}

function fromSpec(spec: ProfileFieldSpec, api?: OnboardingQuestion): FormQuestion {
  return {
    key: api ? String(api.id) : `x:${spec.key}`,
    section: spec.section,
    label: spec.label ?? api?.question_text ?? '',
    hint: spec.hint,
    fieldType: spec.fieldType ?? toFieldType(api?.field_type),
    required: spec.required ?? Boolean(asNumber(api?.is_required)),
    options: spec.options
      ? spec.options.map(({ value, label, exclusive }) => ({ value, label, exclusive }))
      : (api?.options ?? []).map((option) => ({ value: String(option.id), label: option.name })),
    placeholder: spec.placeholder,
    maxLength: spec.maxLength,
    api,
    spec,
    optionSource: spec.options ? 'spec' : 'api',
  }
}

export function buildProfileSections(steps: OnboardingStepGroup[]): ProfileSections {
  const sections: ProfileSections = { demographics: [], professional: [], lifestyle: [], preferences: [] }
  const specsByCategory = new Map(profileFieldSpecs.map((spec) => [spec.category, spec]))
  const bound = new Set<string>()

  for (const question of flattenQuestions(steps)) {
    const spec = question.dropdown_category ? specsByCategory.get(question.dropdown_category) : undefined
    if (spec) {
      if (bound.has(spec.key)) continue
      bound.add(spec.key)
      if (spec.mode !== 'hidden') sections[spec.section].push(fromSpec(spec, question))
      continue
    }
    const section = API_STEP_SECTIONS[question.step_no]
    if (section) sections[section].push(fromApi(question, section))
  }

  for (const spec of profileFieldSpecs) {
    if (spec.mode === 'standalone' && !bound.has(spec.key)) sections[spec.section].push(fromSpec(spec))
  }

  return sections
}

export function isProfessionalEmployment(sections: ProfileSections, values: AnswerValues) {
  const question = sections.demographics.find((item) => item.spec?.key === 'employmentStatus')
  const value = question ? values[question.key] : undefined
  return typeof value === 'string' && (PROFESSIONAL_EMPLOYMENT_VALUES as readonly string[]).includes(value)
}

export function hasAnswer(value: AnswerValue | undefined) {
  if (Array.isArray(value)) return value.length > 0
  return typeof value === 'string' && value.trim().length > 0
}

export function validateQuestions(questions: FormQuestion[], values: AnswerValues) {
  const errors: Record<string, string> = {}
  for (const question of questions) {
    const value = values[question.key]
    if (question.required && !hasAnswer(value)) {
      errors[`q-${question.key}`] =
        question.fieldType === 'checkbox'
          ? 'Please select at least one option.'
          : question.fieldType === 'text'
            ? 'Please fill in this field.'
            : 'Please select an option.'
      continue
    }
    if (question.fieldType === 'text' && typeof value === 'string' && question.maxLength && value.trim().length > question.maxLength) {
      errors[`q-${question.key}`] = `Please use ${question.maxLength} characters or fewer.`
    }
  }
  return errors
}

export function optionLabel(question: FormQuestion, value: string) {
  return question.options.find((option) => option.value === value)?.label ?? value
}

export function answerDisplay(question: FormQuestion, value: AnswerValue | undefined) {
  if (Array.isArray(value)) return value.map((item) => optionLabel(question, item)).join(', ')
  if (!value) return ''
  return question.fieldType === 'text' ? value : optionLabel(question, value)
}

function resolveOptionId(question: FormQuestion, value: string) {
  const specOption = question.spec?.options?.find((option) => option.value === value)
  if (!specOption || !question.api) return undefined
  const names = [specOption.label, ...(specOption.aliases ?? [])].map(normalizeLabel)
  return question.api.options.find((option) => names.includes(normalizeLabel(option.name)))?.id
}

function specValueForName(question: FormQuestion, name: string) {
  const wanted = normalizeLabel(name)
  return question.spec?.options?.find((option) =>
    [option.label, ...(option.aliases ?? [])].some((candidate) => normalizeLabel(candidate) === wanted),
  )?.value
}

function answerFor(question: FormQuestion & { api: OnboardingQuestion }, value: AnswerValue): BuiltAnswers {
  const questionId = asNumber(question.api.id)
  if (question.fieldType === 'text') {
    const text = typeof value === 'string' ? value.trim().slice(0, ANSWER_TEXT_MAX) : ''
    return { answers: text ? [{ question_id: questionId, answer_text: text }] : [], unmapped: [] }
  }

  const multiple = Array.isArray(value)
  const selected = multiple ? value : [value]
  const toInput = (ids: number[]): OnboardingAnswerInput =>
    multiple ? { question_id: questionId, answer_ref_ids: ids } : { question_id: questionId, answer_ref_id: ids[0] }

  if (question.optionSource === 'api') {
    const ids = selected.map((item) => asNumber(item)).filter(Boolean)
    return { answers: ids.length ? [toInput(ids)] : [], unmapped: [] }
  }

  const resolved = selected.map((item) => resolveOptionId(question, item))
  if (resolved.every((id): id is number => id != null)) return { answers: [toInput(resolved)], unmapped: [] }

  // Some chosen options do not exist on the backend yet: keep the full choice as readable text.
  const text = selected.map((item) => optionLabel(question, item)).join(TEXT_SEPARATOR)
  if (text.length <= ANSWER_TEXT_MAX) return { answers: [{ question_id: questionId, answer_text: text }], unmapped: [] }
  const known = resolved.filter((id): id is number => id != null)
  return { answers: known.length ? [toInput(known)] : [], unmapped: [question.label] }
}

export function buildProfileAnswers(questions: FormQuestion[], values: AnswerValues): BuiltAnswers {
  const result: BuiltAnswers = { answers: [], unmapped: [] }
  for (const question of questions) {
    const value = values[question.key]
    if (!hasAnswer(value)) continue
    if (!question.api) {
      result.unmapped.push(question.label)
      continue
    }
    const built = answerFor(question as FormQuestion & { api: OnboardingQuestion }, value)
    result.answers.push(...built.answers)
    result.unmapped.push(...built.unmapped)
  }
  return result
}

export function answersToFormValues(answers: OnboardingAnswer[], questions: FormQuestion[]): AnswerValues {
  const values: AnswerValues = {}
  for (const question of questions) {
    if (!question.api) continue
    const apiId = asNumber(question.api.id)
    const rows = answers.filter((answer) => asNumber(answer.question_id) === apiId)
    if (!rows.length) continue

    if (question.fieldType === 'text') {
      values[question.key] = rows[0]?.answer_text ?? ''
      continue
    }

    const selected =
      question.optionSource === 'api'
        ? rows.map((row) => String(row.answer_ref_id ?? '')).filter(Boolean)
        : rows
            .flatMap((row) => {
              const refId = asNumber(row.answer_ref_id)
              if (refId) {
                const name = question.api?.options.find((option) => asNumber(option.id) === refId)?.name ?? row.answer_text
                return [specValueForName(question, name ?? '')]
              }
              return (row.answer_text ?? '').split(TEXT_SEPARATOR).map((part) => specValueForName(question, part))
            })
            .filter((item): item is string => Boolean(item))

    if (!selected.length) continue
    values[question.key] = question.fieldType === 'checkbox' ? Array.from(new Set(selected)) : selected[0]
  }
  return values
}

export function buildConsentAnswers(steps: OnboardingStepGroup[], consents: Record<ConsentField, boolean>): BuiltAnswers {
  const result: BuiltAnswers = { answers: [], unmapped: [] }
  const privacyQuestions = flattenQuestions(steps).filter((question) => question.step_no === 5)
  for (const binding of consentBindings) {
    const wanted = binding.texts.map(normalizeLabel)
    const question = privacyQuestions.find(
      (item) => binding.ids?.includes(item.id) || wanted.includes(normalizeLabel(item.question_text)),
    )
    if (!question) {
      if (consents[binding.field]) result.unmapped.push(binding.texts[0] ?? binding.field)
      continue
    }
    const optionId = findYesNoId(question, consents[binding.field])
    if (optionId != null) result.answers.push({ question_id: question.id, answer_ref_id: optionId })
  }
  return result
}

export function buildAccountAnswers(
  steps: OnboardingStepGroup[],
  account: { countryName: string; dateOfBirthIso: string },
): BuiltAnswers {
  const result: BuiltAnswers = { answers: [], unmapped: [] }
  const questions = flattenQuestions(steps)
  const entries: Array<[string, string, string]> = [
    [accountAnswerCategories.country, account.countryName, 'Country of residence'],
    [accountAnswerCategories.dateOfBirth, account.dateOfBirthIso, 'Date of birth'],
  ]
  for (const [category, text, label] of entries) {
    if (!text) continue
    const question = questions.find((item) => item.dropdown_category === category)
    if (question) result.answers.push({ question_id: question.id, answer_text: text })
    else result.unmapped.push(label)
  }
  return result
}

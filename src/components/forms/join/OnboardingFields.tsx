import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Select } from '@/components/ui/select'
import type { OnboardingQuestion } from '@/types/api'

export function OnboardingFields({
  questions,
  values,
  errors,
  onChange,
}: {
  questions: OnboardingQuestion[]
  values: Record<string, string | string[]>
  errors: Record<string, string>
  onChange: (questionId: number, value: string | string[]) => void
}) {
  return (
    <div className="mt-6 grid gap-5">
      {questions.map((question) => {
        const key = String(question.id)
        const error = errors[`q-${question.id}`]
        const value = values[key]
        const options = (question.options ?? []).map((option) => ({
          value: String(option.id),
          label: option.name,
        }))

        if (question.field_type === 'dropdown') {
          return (
            <Field
              key={question.id}
              label={question.question_text}
              htmlFor={`q-${question.id}`}
              required={Boolean(question.is_required)}
              error={error}
            >
              <Select
                id={`q-${question.id}`}
                value={typeof value === 'string' ? value : ''}
                placeholder="Select an option"
                options={options}
                onChange={(event) => onChange(question.id, event.target.value)}
              />
            </Field>
          )
        }

        if (question.field_type === 'checkbox') {
          const selected = Array.isArray(value) ? value : []
          return (
            <Field
              key={question.id}
              label={question.question_text}
              required={Boolean(question.is_required)}
              error={error}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {options.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm">
                    <Checkbox
                      checked={selected.includes(option.value)}
                      onCheckedChange={() => {
                        onChange(
                          question.id,
                          selected.includes(option.value)
                            ? selected.filter((item) => item !== option.value)
                            : [...selected, option.value],
                        )
                      }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </Field>
          )
        }

        return (
          <Field
            key={question.id}
            label={question.question_text}
            required={Boolean(question.is_required)}
            error={error}
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink"
                >
                  <input
                    type="radio"
                    className="size-4 shrink-0 accent-teal"
                    name={`q-${question.id}`}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => onChange(question.id, option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </Field>
        )
      })}
    </div>
  )
}

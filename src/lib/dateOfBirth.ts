export const MIN_MEMBER_AGE = 18
const MIN_BIRTH_YEAR = 1900

/** Formats typed digits as DD/MM/YYYY while the user types. */
export function formatDateOfBirthInput(raw: string) {
  const autofilled = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim())
  if (autofilled) return `${autofilled[3]}/${autofilled[2]}/${autofilled[1]}`
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

function parseDateOfBirth(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim())
  if (!match) return null
  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return { day, month, year, date }
}

function ageOn(birth: Date, today: Date) {
  let age = today.getFullYear() - birth.getFullYear()
  const beforeBirthday =
    today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  if (beforeBirthday) age -= 1
  return age
}

export function validateDateOfBirth(value: string, today = new Date()) {
  if (!value.trim()) return 'Date of birth is required.'
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value.trim())) return 'Enter your date of birth as DD / MM / YYYY.'
  const parsed = parseDateOfBirth(value)
  if (!parsed) return 'Enter a real calendar date, for example 15/08/1990.'
  if (parsed.date > today) return 'Date of birth cannot be in the future.'
  if (parsed.year < MIN_BIRTH_YEAR) return 'Please check the year of your date of birth.'
  if (ageOn(parsed.date, today) < MIN_MEMBER_AGE) return `You must be at least ${MIN_MEMBER_AGE} years old to join.`
  return ''
}

/** YYYY-MM-DD for the backend, or an empty string when the value is not a valid date. */
export function dateOfBirthToIso(value: string) {
  const parsed = parseDateOfBirth(value)
  if (!parsed) return ''
  return `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`
}

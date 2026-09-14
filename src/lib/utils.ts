import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { API_BASE_URL } from '@/config/env'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function asNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function parseApiDate(value: string) {
  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? new Date(value) : date
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parseApiDate(value))
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parseApiDate(value))
}

export function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

export function givenName(name?: string | null) {
  return splitName(name ?? '').firstName || 'there'
}

export function initials(name: string) {
  const { firstName, lastName } = splitName(name)
  const first = firstName.charAt(0)
  const last = lastName.charAt(0) || firstName.charAt(1)
  return `${first}${last}`.toUpperCase() || 'AO'
}

export function mediaUrl(path: string | null | undefined) {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  if (!API_BASE_URL) return path
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, differenceInDays, parseISO } from 'date-fns'
import { ms } from 'date-fns/locale/ms'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a date in Malay locale
export function formatDateMY(date: Date | string | null): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'd MMMM yyyy', { locale: ms })
}

// Format year only
export function formatYear(date: Date | string | null): string {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'yyyy')
}

// Get age from birthdate
export function getAge(birthDate: Date | string | null, deathDate?: Date | string | null): string {
  if (!birthDate) return ''
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate
  const end = deathDate
    ? typeof deathDate === 'string'
      ? parseISO(deathDate)
      : deathDate
    : new Date()
  const age = Math.floor((end.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
  return `${age} tahun`
}

// Get days until next birthday
export function daysUntilBirthday(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate
  const today = new Date()
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1)
  }
  return differenceInDays(nextBirthday, today)
}

// Format birthday relative label
export function birthdayLabel(birthDate: Date | string): string {
  const days = daysUntilBirthday(birthDate)
  if (days === 0) return 'Hari ini!'
  if (days === 1) return 'Esok'
  return `${days} hari lagi`
}

// Gender label in Malay
export function genderLabel(gender: string): string {
  return gender === 'MALE' ? 'Lelaki' : 'Perempuan'
}

// Religion label in Malay
export function religionLabel(religion: string): string {
  const map: Record<string, string> = {
    ISLAM: 'Islam',
    CHRISTIAN: 'Kristian',
    BUDDHIST: 'Buddha',
    HINDU: 'Hindu',
    OTHERS: 'Lain-lain',
  }
  return map[religion] || religion
}

// Relationship type label in Malay
export function relationshipLabel(type: string, gender?: string): string {
  const map: Record<string, string> = {
    PARENT: 'Ibu Bapa',
    CHILD: 'Anak',
    SPOUSE: 'Pasangan',
    SIBLING: 'Adik-beradik',
  }
  return map[type] || type
}

// Role label in Malay
export function roleLabel(role: string): string {
  const map: Record<string, string> = {
    OWNER: 'Pemilik',
    EDITOR: 'Editor',
    VIEWER: 'Penonton',
  }
  return map[role] || role
}

// Generate avatar initials
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// Branch color palette (8 distinct colors)
const BRANCH_COLORS = [
  '#1B4332', // Deep green
  '#D4A017', // Gold
  '#7B2D8B', // Purple
  '#C0392B', // Red
  '#1A5276', // Blue
  '#784212', // Brown
  '#117A65', // Teal
  '#6E2F8B', // Violet
]

export function getBranchColor(branch: string | null | undefined): string {
  if (!branch) return BRANCH_COLORS[0]
  let hash = 0
  for (let i = 0; i < branch.length; i++) {
    hash = branch.charCodeAt(i) + ((hash << 5) - hash)
  }
  return BRANCH_COLORS[Math.abs(hash) % BRANCH_COLORS.length]
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// Generate a short, user-friendly invite code like SAL-AB12CD
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no I/O/0/1 to avoid confusion
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `SAL-${code}`
}

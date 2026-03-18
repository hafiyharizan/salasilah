import { z } from 'zod'

export const memberSchema = z.object({
  fullName: z.string().min(2, 'Nama mesti sekurang-kurangnya 2 aksara').max(200),
  nickname: z.string().max(100).optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  isDeceased: z.boolean().optional().default(false),
  placeOfBirth: z.string().max(200).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),

  // Malaysian cultural fields
  binBinti: z.string().max(200).optional(),
  icNumber: z.string().regex(/^\d{6}-\d{2}-\d{4}$/, 'Format IC tidak sah (000000-00-0000)').optional().or(z.literal('')),
  kampung: z.string().max(200).optional(),
  negeri: z.string().max(100).optional(),
  religion: z.enum(['ISLAM', 'CHRISTIAN', 'BUDDHIST', 'HINDU', 'OTHERS']).optional(),
  familyBranch: z.string().max(200).optional(),
  generationalTitle: z.string().max(50).optional(),

  // Additional
  occupation: z.string().max(200).optional(),
  biography: z.string().max(5000).optional(),
  contactEmail: z.string().email('Emel tidak sah').optional().or(z.literal('')),
  contactPhone: z.string().max(20).optional(),
})

export const familySchema = z.object({
  name: z.string().min(2, 'Nama keluarga mesti sekurang-kurangnya 2 aksara').max(100),
  description: z.string().max(500).optional(),
})

export const inviteSchema = z.object({
  email: z.string().email('Emel tidak sah'),
  role: z.enum(['OWNER', 'EDITOR', 'VIEWER']),
})

export const relationshipSchema = z.object({
  fromId: z.string().cuid(),
  toId: z.string().cuid(),
  type: z.enum(['PARENT', 'CHILD', 'SPOUSE', 'SIBLING']),
  bidirectional: z.boolean().optional().default(true),
})

export type MemberFormData = z.infer<typeof memberSchema>
export type FamilyFormData = z.infer<typeof familySchema>
export type InviteFormData = z.infer<typeof inviteSchema>

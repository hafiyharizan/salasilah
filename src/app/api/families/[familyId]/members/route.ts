import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Gender, Religion, FamilyRole } from '@prisma/client'
import { z } from 'zod'

const memberSchema = z.object({
  fullName: z.string().min(2).max(200),
  nickname: z.string().optional(),
  gender: z.nativeEnum(Gender),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  isDeceased: z.boolean().optional(),
  placeOfBirth: z.string().optional(),
  photoUrl: z.string().optional(),
  binBinti: z.string().optional(),
  icNumber: z.string().optional(),
  kampung: z.string().optional(),
  negeri: z.string().optional(),
  religion: z.nativeEnum(Religion).optional(),
  familyBranch: z.string().optional(),
  generationalTitle: z.string().optional(),
  occupation: z.string().optional(),
  biography: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
})

type FamilyRouteContext = {
  params: Promise<{ familyId: string }>
}

async function requireFamilyAccess(familyId: string, userId: string) {
  return prisma.family.findFirst({
    where: { id: familyId, ownerId: userId },
  })
}

// GET /api/families/[familyId]/members
export async function GET(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('q')

  const where: Record<string, unknown> = { familyId }

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { nickname: { contains: search, mode: 'insensitive' } },
      { kampung: { contains: search, mode: 'insensitive' } },
      { familyBranch: { contains: search, mode: 'insensitive' } },
      { generationalTitle: { contains: search, mode: 'insensitive' } },
      { binBinti: { contains: search, mode: 'insensitive' } },
      { negeri: { contains: search, mode: 'insensitive' } },
    ]
  }

  const members = await prisma.familyMember.findMany({
    where,
    orderBy: [{ birthDate: 'asc' }, { fullName: 'asc' }],
  })

  return NextResponse.json({ members })
}

// POST /api/families/[familyId]/members
export async function POST(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  // Check family access
  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const data = memberSchema.parse(body)

    const member = await prisma.familyMember.create({
      data: {
        ...data,
        familyId,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        deathDate: data.deathDate ? new Date(data.deathDate) : undefined,
        religion: data.religion ?? Religion.ISLAM,
        role: FamilyRole.VIEWER,
        contactEmail: data.contactEmail || undefined,
      },
    })

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

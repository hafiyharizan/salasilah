import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PhotoCategory } from '@prisma/client'
import { z } from 'zod'

const photoSchema = z.object({
  url: z.string().url(),
  memberId: z.string().optional(),
  caption: z.string().optional(),
  category: z.nativeEnum(PhotoCategory).optional(),
  takenAt: z.string().optional(),
})

type FamilyRouteContext = {
  params: Promise<{ familyId: string }>
}

async function requireFamilyAccess(familyId: string, userId: string) {
  return prisma.family.findFirst({
    where: { id: familyId, ownerId: userId },
  })
}

// GET /api/families/[familyId]/photos
export async function GET(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const memberId = searchParams.get('memberId')

  const photos = await prisma.photo.findMany({
    where: {
      familyId,
      ...(memberId ? { memberId } : {}),
    },
    include: {
      member: { select: { id: true, fullName: true, photoUrl: true } },
      uploader: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ photos })
}

// POST /api/families/[familyId]/photos
export async function POST(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const data = photoSchema.parse(body)

    const photo = await prisma.photo.create({
      data: {
        ...data,
        familyId,
        uploadedById: session.user.id,
        category: data.category ?? PhotoCategory.FAMILY,
        takenAt: data.takenAt ? new Date(data.takenAt) : undefined,
      },
    })

    return NextResponse.json({ photo }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

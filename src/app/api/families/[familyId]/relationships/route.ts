import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { RelationshipType } from '@prisma/client'
import { z } from 'zod'

const relSchema = z.object({
  fromId: z.string(),
  toId: z.string(),
  type: z.nativeEnum(RelationshipType),
  label: z.string().optional(),
  bidirectional: z.boolean().optional().default(true),
})

type FamilyRouteContext = {
  params: Promise<{ familyId: string }>
}

async function requireFamilyAccess(familyId: string, userId: string) {
  return prisma.family.findFirst({
    where: { id: familyId, ownerId: userId },
  })
}

// GET /api/families/[familyId]/relationships
export async function GET(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const relationships = await prisma.relationship.findMany({
    where: { familyId },
    include: {
      from: { select: { id: true, fullName: true } },
      to: { select: { id: true, fullName: true } },
    },
  })

  return NextResponse.json({ relationships })
}

// POST /api/families/[familyId]/relationships
export async function POST(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const { fromId, toId, type, label, bidirectional } = relSchema.parse(body)

    const relatedMembers = await prisma.familyMember.count({
      where: {
        familyId,
        id: { in: [fromId, toId] },
      },
    })
    if (relatedMembers !== 2) {
      return NextResponse.json({ error: 'Ahli keluarga tidak sah' }, { status: 400 })
    }

    // Create the primary relationship
    const rel = await prisma.relationship.upsert({
      where: { fromId_toId_type: { fromId, toId, type } },
      update: {},
      create: { fromId, toId, type, label, familyId },
    })

    // Auto-create the inverse relationship if bidirectional
    if (bidirectional) {
      const inverseType = getInverseType(type)
      if (inverseType) {
        await prisma.relationship.upsert({
          where: { fromId_toId_type: { fromId: toId, toId: fromId, type: inverseType } },
          update: {},
          create: { fromId: toId, toId: fromId, type: inverseType, familyId },
        })
      }
    }

    return NextResponse.json({ relationship: rel }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/families/[familyId]/relationships?fromId=&toId=&type=
export async function DELETE(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const fromId = searchParams.get('fromId')!
  const toId = searchParams.get('toId')!
  const type = searchParams.get('type') as RelationshipType

  await prisma.relationship.deleteMany({
    where: { fromId, toId, type, familyId },
  })

  return NextResponse.json({ success: true })
}

function getInverseType(type: RelationshipType): RelationshipType | null {
  switch (type) {
    case RelationshipType.PARENT: return RelationshipType.CHILD
    case RelationshipType.CHILD: return RelationshipType.PARENT
    case RelationshipType.SPOUSE: return RelationshipType.SPOUSE
    case RelationshipType.SIBLING: return RelationshipType.SIBLING
    default: return null
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildTreeData } from '@/lib/tree-utils'

type FamilyRouteContext = {
  params: Promise<{ familyId: string }>
}

async function requireFamilyOwner(familyId: string, userId: string) {
  return prisma.family.findFirst({
    where: { id: familyId, ownerId: userId },
    select: { id: true },
  })
}

// GET /api/families/[familyId]/tree
export async function GET(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { familyId } = await context.params
  const family = await requireFamilyOwner(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [members, relationships, savedLayouts] = await Promise.all([
    prisma.familyMember.findMany({
      where: { familyId },
      orderBy: { birthDate: 'asc' },
    }),
    prisma.relationship.findMany({
      where: { familyId },
    }),
    prisma.treeNodeLayout.findMany({
      where: { familyId },
      select: { memberId: true, x: true, y: true },
    }),
  ])

  const savedPositions = Object.fromEntries(
    savedLayouts.map((layout) => [layout.memberId, { x: layout.x, y: layout.y }])
  )

  const treeData = buildTreeData(members, relationships, savedPositions)
  return NextResponse.json(treeData)
}

// POST /api/families/[familyId]/tree — save dragged node positions
export async function POST(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { familyId } = await context.params
  const family = await requireFamilyOwner(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json() as {
    nodes?: Array<{ id: string; position?: { x?: number; y?: number } }>
  }

  const nodes = (body.nodes ?? []).filter(
    (n) => typeof n.position?.x === 'number' && typeof n.position?.y === 'number'
  )

  if (nodes.length === 0) {
    return NextResponse.json({ ok: true, saved: 0 })
  }

  await prisma.$transaction(
    nodes.map((node) =>
      prisma.treeNodeLayout.upsert({
        where: {
          familyId_memberId: {
            familyId,
            memberId: node.id,
          },
        },
        create: {
          familyId,
          memberId: node.id,
          x: node.position!.x!,
          y: node.position!.y!,
        },
        update: {
          x: node.position!.x!,
          y: node.position!.y!,
        },
      })
    )
  )

  return NextResponse.json({ ok: true, saved: nodes.length })
}

// DELETE /api/families/[familyId]/tree — reset to auto layout
export async function DELETE(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { familyId } = await context.params
  const family = await requireFamilyOwner(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.treeNodeLayout.deleteMany({
    where: { familyId },
  })

  return NextResponse.json({ ok: true })
}

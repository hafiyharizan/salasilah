import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildTreeData } from '@/lib/tree-utils'

type FamilyRouteContext = {
  params: Promise<{ familyId: string }>
}

// GET /api/families/[familyId]/tree
export async function GET(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await prisma.family.findFirst({
    where: { id: familyId, ownerId: session.user.id },
    select: { id: true },
  })
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [members, relationships] = await Promise.all([
    prisma.familyMember.findMany({
      where: { familyId },
      orderBy: { birthDate: 'asc' },
    }),
    prisma.relationship.findMany({
      where: { familyId },
    }),
  ])

  const treeData = buildTreeData(members, relationships)

  return NextResponse.json(treeData)
}

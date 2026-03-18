import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

async function checkAccess(familyId: string, userId: string) {
  const family = await prisma.family.findFirst({
    where: { id: familyId, ownerId: userId },
  })
  return family
}

type FamilyRouteContext = {
  params: Promise<{ familyId: string }>
}

// GET /api/families/[familyId]
export async function GET(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await prisma.family.findFirst({
    where: { id: familyId, ownerId: session.user.id },
    include: {
      _count: { select: { members: true } },
    },
  })

  if (!family) return NextResponse.json({ error: 'Tidak dijumpai' }, { status: 404 })

  return NextResponse.json({ family })
}

// PUT /api/families/[familyId]
export async function PUT(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await checkAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const updated = await prisma.family.update({
    where: { id: familyId },
    data: {
      name: body.name ?? family.name,
      description: body.description ?? family.description,
    },
  })

  return NextResponse.json({ family: updated })
}

// DELETE /api/families/[familyId]
export async function DELETE(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await checkAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.family.delete({ where: { id: familyId } })

  return NextResponse.json({ success: true })
}

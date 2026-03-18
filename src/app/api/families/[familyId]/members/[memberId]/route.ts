import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Religion } from '@prisma/client'

type Params = { familyId: string; memberId: string }

type MemberRouteContext = {
  params: Promise<Params>
}

async function requireFamilyAccess(familyId: string, userId: string) {
  return prisma.family.findFirst({
    where: { id: familyId, ownerId: userId },
  })
}

// GET /api/families/[familyId]/members/[memberId]
export async function GET(request: NextRequest, context: MemberRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId, memberId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const member = await prisma.familyMember.findFirst({
    where: { id: memberId, familyId },
    include: {
      relationshipsAsFrom: {
        include: { to: true },
      },
      relationshipsAsTo: {
        include: { from: true },
      },
      photos: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })

  if (!member) return NextResponse.json({ error: 'Tidak dijumpai' }, { status: 404 })

  return NextResponse.json({ member })
}

// PUT /api/families/[familyId]/members/[memberId]
export async function PUT(request: NextRequest, context: MemberRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId, memberId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const member = await prisma.familyMember.findFirst({
    where: { id: memberId, familyId },
    select: { id: true },
  })
  if (!member) return NextResponse.json({ error: 'Tidak dijumpai' }, { status: 404 })

  const body = await request.json()

  const updated = await prisma.familyMember.update({
    where: { id: memberId },
    data: {
      ...body,
      birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      deathDate: body.deathDate ? new Date(body.deathDate) : undefined,
      religion: body.religion ?? Religion.ISLAM,
      contactEmail: body.contactEmail || undefined,
    },
  })

  return NextResponse.json({ member: updated })
}

// DELETE /api/families/[familyId]/members/[memberId]
export async function DELETE(request: NextRequest, context: MemberRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId, memberId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const member = await prisma.familyMember.findFirst({
    where: { id: memberId, familyId },
    select: { id: true },
  })
  if (!member) return NextResponse.json({ error: 'Tidak dijumpai' }, { status: 404 })

  await prisma.familyMember.delete({ where: { id: memberId } })

  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FamilyRole } from '@prisma/client'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(FamilyRole),
})

type FamilyRouteContext = {
  params: Promise<{ familyId: string }>
}

async function requireFamilyAccess(familyId: string, userId: string) {
  return prisma.family.findFirst({
    where: { id: familyId, ownerId: userId },
  })
}

// GET /api/families/[familyId]/invite — list invites
export async function GET(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const invites = await prisma.invite.findMany({
    where: { familyId },
    include: { sender: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ invites })
}

// POST /api/families/[familyId]/invite — send invite
export async function POST(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const { email, role } = inviteSchema.parse(body)

    // Check if already invited
    const existing = await prisma.invite.findFirst({
      where: { familyId, email, status: 'PENDING' },
    })
    if (existing) {
      return NextResponse.json({ error: 'Jemputan sudah dihantar ke emel ini' }, { status: 409 })
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    const invite = await prisma.invite.create({
      data: {
        familyId,
        email,
        role,
        senderId: session.user.id,
        expiresAt,
      },
    })

    // In production, send email with invite.token here
    // e.g., sendInviteEmail(email, invite.token, family.name)

    return NextResponse.json({
      invite,
      inviteUrl: `${process.env.NEXTAUTH_URL}/invite/${invite.token}`,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/families/[familyId]/invite?inviteId= — revoke invite
export async function DELETE(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await requireFamilyAccess(familyId, session.user.id)
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const inviteId = searchParams.get('inviteId')
  if (!inviteId) return NextResponse.json({ error: 'inviteId required' }, { status: 400 })

  const invite = await prisma.invite.findFirst({
    where: { id: inviteId, familyId },
    select: { id: true },
  })
  if (!invite) return NextResponse.json({ error: 'Tidak dijumpai' }, { status: 404 })

  await prisma.invite.delete({ where: { id: inviteId } })

  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Context = { params: Promise<{ token: string }> }

// POST /api/invite/[token] — accept an invite
export async function POST(request: NextRequest, context: Context) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { token } = await context.params

  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { family: { select: { id: true, name: true } } },
  })

  if (!invite) return NextResponse.json({ error: 'Jemputan tidak dijumpai' }, { status: 404 })

  if (invite.status === 'ACCEPTED') {
    return NextResponse.json({ error: 'Jemputan ini telah diterima' }, { status: 409 })
  }

  if (invite.status === 'EXPIRED' || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Jemputan ini telah tamat tempoh' }, { status: 410 })
  }

  if (invite.email.toLowerCase() !== session.user.email?.toLowerCase()) {
    return NextResponse.json({ error: 'Jemputan ini bukan untuk akaun anda' }, { status: 403 })
  }

  // Check if user already has a member record in this family
  const existing = await prisma.familyMember.findFirst({
    where: { familyId: invite.familyId, userId: session.user.id },
  })

  await prisma.$transaction([
    existing
      ? prisma.familyMember.update({
          where: { id: existing.id },
          data: { role: invite.role },
        })
      : prisma.familyMember.create({
          data: {
            familyId: invite.familyId,
            fullName: session.user.name ?? invite.email,
            gender: 'MALE',
            userId: session.user.id,
            role: invite.role,
          },
        }),
    prisma.invite.update({
      where: { id: invite.id },
      data: { status: 'ACCEPTED' },
    }),
  ])

  return NextResponse.json({ familyId: invite.familyId })
}

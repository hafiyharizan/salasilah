import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/families/join — join a family using an invite code
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const code = (body.code as string)?.trim().toUpperCase()

  if (!code) {
    return NextResponse.json({ error: 'Invite code is required' }, { status: 400 })
  }

  // Find family by invite code
  const family = await prisma.family.findUnique({
    where: { inviteCode: code },
    select: { id: true, name: true, ownerId: true },
  })

  if (!family) {
    return NextResponse.json({ error: 'invalid-code' }, { status: 404 })
  }

  // Check if user is already the owner
  if (family.ownerId === session.user.id) {
    return NextResponse.json({ error: 'already-member', familyId: family.id, familyName: family.name }, { status: 409 })
  }

  // Check if user already has a FamilyMember linked to this family
  const existingMembership = await prisma.familyMember.findFirst({
    where: { familyId: family.id, userId: session.user.id },
  })

  if (existingMembership) {
    return NextResponse.json({ error: 'already-member', familyId: family.id, familyName: family.name }, { status: 409 })
  }

  // Create a FamilyMember record linked to the user
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  })

  await prisma.familyMember.create({
    data: {
      familyId: family.id,
      fullName: user?.name || user?.email || 'New Member',
      gender: 'MALE', // default, user can edit their profile later
      userId: session.user.id,
      role: 'VIEWER',
    },
  })

  return NextResponse.json({ familyId: family.id, familyName: family.name })
}

// GET /api/families/join?code=XXX — validate code and return family name (preview before joining)
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const code = request.nextUrl.searchParams.get('code')?.trim().toUpperCase()

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 })
  }

  const family = await prisma.family.findUnique({
    where: { inviteCode: code },
    select: {
      id: true,
      name: true,
      ownerId: true,
      _count: { select: { members: true } },
    },
  })

  if (!family) {
    return NextResponse.json({ error: 'invalid-code' }, { status: 404 })
  }

  // Check if already a member
  const isMember = family.ownerId === session.user.id || await prisma.familyMember.findFirst({
    where: { familyId: family.id, userId: session.user.id },
  })

  return NextResponse.json({
    familyName: family.name,
    memberCount: family._count.members,
    alreadyMember: !!isMember,
  })
}

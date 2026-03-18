import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type FamilyRouteContext = {
  params: Promise<{ familyId: string }>
}

// GET /api/families/[familyId]/search?q=
export async function GET(request: NextRequest, context: FamilyRouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { familyId } = await context.params

  const family = await prisma.family.findFirst({
    where: { id: familyId, ownerId: session.user.id },
    select: { id: true },
  })
  if (!family) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ members: [], total: 0 })
  }

  const members = await prisma.familyMember.findMany({
    where: {
      familyId,
      OR: [
        { fullName: { contains: q, mode: 'insensitive' } },
        { nickname: { contains: q, mode: 'insensitive' } },
        { currentAddress: { contains: q, mode: 'insensitive' } },
        { negeri: { contains: q, mode: 'insensitive' } },
        { familyBranch: { contains: q, mode: 'insensitive' } },
        { generationalTitle: { contains: q, mode: 'insensitive' } },
        { binBinti: { contains: q, mode: 'insensitive' } },
        { occupation: { contains: q, mode: 'insensitive' } },
      ],
    },
    orderBy: { fullName: 'asc' },
    take: 20,
  })

  return NextResponse.json({ members, total: members.length })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createFamilySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
})

// GET /api/families — list families for current user
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const families = await prisma.family.findMany({
    where: { ownerId: session.user.id },
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ families })
}

// POST /api/families — create a new family
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { name, description } = createFamilySchema.parse(body)

    const family = await prisma.family.create({
      data: { name, description, ownerId: session.user.id },
    })

    return NextResponse.json({ family }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

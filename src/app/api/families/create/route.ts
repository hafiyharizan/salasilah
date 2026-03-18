import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/families/create — handles form POST from dashboard onboarding
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.redirect(new URL('/login', request.url))

  const formData = await request.formData()
  const name = (formData.get('name') as string)?.trim()

  if (!name || name.length < 2) {
    return NextResponse.redirect(new URL('/dashboard?error=invalid-name', request.url))
  }

  await prisma.family.create({
    data: { name, ownerId: session.user.id },
  })

  return NextResponse.redirect(new URL('/dashboard', request.url))
}

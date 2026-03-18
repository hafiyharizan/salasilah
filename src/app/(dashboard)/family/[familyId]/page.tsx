import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FamilyTreeCanvas } from '@/components/tree/FamilyTreeCanvas'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'

interface Props {
  params: Promise<{ familyId: string }>
}

export async function generateMetadata({ params }: Props) {
  const { familyId } = await params
  const family = await prisma.family.findUnique({ where: { id: familyId } })
  return { title: family?.name ? `Tree — ${family.name}` : 'Family Tree' }
}

export default async function FamilyTreePage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const { familyId } = await params

  const [family, t, tMember] = await Promise.all([
    prisma.family.findFirst({
      where: { id: familyId, ownerId: session.user.id },
      include: { _count: { select: { members: true } } },
    }),
    getTranslations('tree'),
    getTranslations('member'),
  ])

  if (!family) notFound()

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] -m-4 sm:-m-6 lg:-m-8 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 z-10">
        <div>
          <h1 className="font-display font-bold text-gray-900 text-lg leading-tight">{family.name}</h1>
          <p className="text-xs text-gray-500">{family._count.members} {tMember('unit')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/family/${familyId}/members`}>
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{tMember('membersTitle')}</span>
            </Button>
          </Link>
          <Link href={`/family/${familyId}/members/new`}>
            <Button size="sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{tMember('addMember')}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Tree Canvas */}
      <div className="flex-1">
        <FamilyTreeCanvas familyId={familyId} />
      </div>
    </div>
  )
}

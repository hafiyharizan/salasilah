import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { FamilyMap } from '@/components/map/FamilyMap'
import { Button } from '@/components/ui/button'
import { MapPin, Plus } from 'lucide-react'

export const metadata = { title: 'Member Locations' }

interface Props {
  params: Promise<{ familyId: string }>
}

export default async function MapPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const { familyId } = await params

  const t = await getTranslations('map')

  const members = await prisma.familyMember.findMany({
    where: { familyId },
    select: {
      id: true,
      fullName: true,
      negeri: true,
      currentAddress: true,
      photoUrl: true,
      familyBranch: true,
      isDeceased: true,
    },
    orderBy: { fullName: 'asc' },
  })

  const membersWithLocation = members.filter((m) => m.negeri)

  return (
    <div>
      <PageHeader
        title={t('title')}
        description={t('description')}
        action={
          <Link href={`/family/${familyId}/members`}>
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4" />
              {t('viewMembers')}
            </Button>
          </Link>
        }
      />

      {membersWithLocation.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title={t('noLocations')}
          description={t('noLocationsDesc')}
          action={
            <Link href={`/family/${familyId}/members`}>
              <Button>
                <Plus className="w-4 h-4" />
                {t('addLocations')}
              </Button>
            </Link>
          }
        />
      ) : (
        <FamilyMap members={members} familyId={familyId} />
      )}
    </div>
  )
}

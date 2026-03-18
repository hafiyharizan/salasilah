import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { MemberAvatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, Search } from 'lucide-react'
import { formatDateMY, genderLabel, getAge } from '@/lib/utils'

export const metadata = { title: 'Ahli Keluarga' }

interface Props {
  params: Promise<{ familyId: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function MembersPage({ params, searchParams }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const [{ familyId }, { q }] = await Promise.all([params, searchParams])

  const [t] = await Promise.all([getTranslations('member')])

  const where: Record<string, unknown> = { familyId }
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: 'insensitive' } },
      { nickname: { contains: q, mode: 'insensitive' } },
      { currentAddress: { contains: q, mode: 'insensitive' } },
      { familyBranch: { contains: q, mode: 'insensitive' } },
      { generationalTitle: { contains: q, mode: 'insensitive' } },
      { negeri: { contains: q, mode: 'insensitive' } },
    ]
  }

  const members = await prisma.familyMember.findMany({
    where,
    orderBy: [{ birthDate: 'asc' }, { fullName: 'asc' }],
  })

  return (
    <div>
      <PageHeader
        title={t('membersTitle')}
        description={`${members.length} ${q ? `— "${q}"` : ''}`}
        action={
          <Link href={`/family/${familyId}/members/new`}>
            <Button size="sm">
              <Plus className="w-4 h-4" />
              {t('addMember')}
            </Button>
          </Link>
        }
      />

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <form method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          />
          <button type="submit" className="sr-only">
            {t('searchPlaceholder')}
          </button>
        </form>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title={q ? `${t('noMembers')} "${q}"` : t('noMembers')}
          description={t('noMembersDesc')}
          action={
            !q ? (
              <Link href={`/family/${familyId}/members/new`}>
                <Button>
                  <Plus className="w-4 h-4" />
                  {t('addMember')}
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/family/${familyId}/members/${member.id}`}
              className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div className="flex items-start gap-4">
                <MemberAvatar
                  name={member.fullName}
                  photoUrl={member.photoUrl}
                  branch={member.familyBranch}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  {member.generationalTitle && (
                    <span className="text-xs text-primary-500 font-medium">{member.generationalTitle}</span>
                  )}
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                    {member.fullName}
                  </h3>
                  {member.binBinti && (
                    <p className="text-xs text-gray-500 truncate">
                      {member.gender === 'FEMALE' ? 'binti' : 'bin'} {member.binBinti}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant={member.gender === 'MALE' ? 'default' : 'secondary'}>
                      {genderLabel(member.gender)}
                    </Badge>
                    {member.isDeceased && <Badge variant="muted">Al-Fatihah</Badge>}
                    {member.currentAddress && (
                      <span className="text-xs text-gray-400 truncate max-w-[100px]">📍 {member.currentAddress}</span>
                    )}
                  </div>
                  {member.birthDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDateMY(member.birthDate)}
                      {!member.isDeceased && ` · ${getAge(member.birthDate)}`}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

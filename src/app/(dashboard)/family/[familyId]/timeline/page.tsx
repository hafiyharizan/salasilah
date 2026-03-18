import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/shared/PageHeader'
import { MemberAvatar } from '@/components/shared/Avatar'
import { EmptyState } from '@/components/shared/EmptyState'
import { Clock } from 'lucide-react'
import { formatDateMY, getBranchColor } from '@/lib/utils'

export const metadata = { title: 'Timeline' }

interface Props {
  params: Promise<{ familyId: string }>
}

type TimelineMember = Awaited<ReturnType<typeof prisma.familyMember.findMany>>[number]

interface TimelineEvent {
  date: Date
  type: 'birth' | 'death'
  member: TimelineMember
}

async function getTimelineEvents(familyId: string) {
  const members = await prisma.familyMember.findMany({
    where: { familyId },
    orderBy: { birthDate: 'asc' },
  })

  const events: TimelineEvent[] = []
  for (const member of members) {
    if (member.birthDate) events.push({ date: member.birthDate, type: 'birth', member })
    if (member.deathDate) events.push({ date: member.deathDate, type: 'death', member })
  }

  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export default async function TimelinePage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const { familyId } = await params

  const [events, t] = await Promise.all([
    getTimelineEvents(familyId),
    getTranslations('timeline'),
  ])

  const byDecade = new Map<number, TimelineEvent[]>()
  for (const event of events) {
    const decade = Math.floor(new Date(event.date).getFullYear() / 10) * 10
    if (!byDecade.has(decade)) byDecade.set(decade, [])
    byDecade.get(decade)!.push(event)
  }

  const decades = Array.from(byDecade.keys()).sort()

  return (
    <div>
      <PageHeader
        title={t('title')}
        description=""
      />

      {events.length === 0 ? (
        <EmptyState
          icon={Clock}
          title={t('noEvents')}
          description={t('noEventsDesc')}
        />
      ) : (
        <div className="space-y-10">
          {decades.map((decade) => (
            <div key={decade}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center shrink-0">
                  <span className="text-white font-display font-bold text-lg">{decade}{t('decade')}</span>
                </div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="ml-4 border-l-2 border-gray-200 space-y-4 pl-6">
                {byDecade.get(decade)!.map((event, i) => {
                  const m = event.member
                  const branchColor = getBranchColor(m.familyBranch)
                  return (
                    <div key={`${m.id}-${event.type}-${i}`} className="relative">
                      <div
                        className="absolute -left-[34px] w-4 h-4 rounded-full border-2 border-white"
                        style={{ backgroundColor: event.type === 'birth' ? branchColor : '#9CA3AF' }}
                      />
                      <Link
                        href={`/family/${familyId}/members/${m.id}`}
                        className="card p-4 flex items-center gap-3 hover:shadow-md transition-all group"
                      >
                        <MemberAvatar name={m.fullName} photoUrl={m.photoUrl} branch={m.familyBranch} size="md" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 font-medium">
                            {formatDateMY(event.date)}
                          </p>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                            {event.type === 'birth' ? `🌱 ${t('born')}` : `🕌 ${t('died')}`}
                            {' · '}
                            {m.generationalTitle && <span className="text-gray-500">{m.generationalTitle} </span>}
                            {m.fullName}
                          </p>
                          {m.kampung && (
                            <p className="text-xs text-gray-400">📍 {m.kampung}{m.negeri ? `, ${m.negeri}` : ''}</p>
                          )}
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

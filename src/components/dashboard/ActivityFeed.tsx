import { Clock } from 'lucide-react'
import type { FamilyMember } from '@prisma/client'
import { getTranslations } from 'next-intl/server'
import { MemberAvatar } from '@/components/shared/Avatar'
import { formatDistanceToNow } from 'date-fns'
import { ms } from 'date-fns/locale/ms'
import { enUS } from 'date-fns/locale/en-US'
import { getLocale } from 'next-intl/server'

interface ActivityFeedProps {
  members: FamilyMember[]
}

export async function ActivityFeed({ members }: ActivityFeedProps) {
  const [t, locale] = await Promise.all([
    getTranslations('dashboard'),
    getLocale(),
  ])

  const dateLocale = locale === 'en' ? enUS : ms

  const activities = members
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8)
    .map((m) => {
      const isNew = new Date(m.createdAt).getTime() === new Date(m.updatedAt).getTime()
      return {
        member: m,
        action: isNew ? t('added') : t('updated'),
        isNew,
        time: m.updatedAt,
      }
    })

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary-500" />
        {t('activityFeed')}
      </h2>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{t('noActivity')}</p>
      ) : (
        <div className="space-y-3">
          {activities.map(({ member, action, isNew, time }) => (
            <div key={member.id} className="flex items-start gap-3 group">
              {/* Timeline dot */}
              <div className="flex flex-col items-center pt-1">
                <MemberAvatar
                  name={member.fullName}
                  photoUrl={member.photoUrl}
                  branch={member.familyBranch}
                  size="sm"
                />
              </div>
              <div className="flex-1 min-w-0 pb-3 border-b border-gray-50 last:border-0">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{member.fullName}</span>{' '}
                  <span className={isNew ? 'text-primary-500 font-medium' : 'text-gray-500'}>{action}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDistanceToNow(new Date(time), { addSuffix: true, locale: dateLocale })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import Link from 'next/link'
import { Cake } from 'lucide-react'
import type { FamilyMember } from '@prisma/client'
import { getTranslations } from 'next-intl/server'
import { MemberAvatar } from '@/components/shared/Avatar'
import { daysUntilBirthday, formatDateMY } from '@/lib/utils'

interface BirthdayWidgetProps {
  members: FamilyMember[]
  familyId: string
}

export async function BirthdayWidget({ members, familyId }: BirthdayWidgetProps) {
  const t = await getTranslations('birthday')

  const upcoming = members
    .filter((m) => m.birthDate && !m.isDeceased)
    .map((m) => ({ member: m, days: daysUntilBirthday(m.birthDate!) }))
    .filter(({ days }) => days <= 30)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5)

  function getBirthdayLabel(days: number): string {
    if (days === 0) return t('today')
    if (days === 1) return t('tomorrow')
    return t('daysLeft', { days })
  }

  if (upcoming.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Cake className="w-5 h-5 text-accent" />
          {t('title')}
        </h2>
        <p className="text-sm text-gray-400 text-center py-6">
          {t('noBirthdays')}
        </p>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Cake className="w-5 h-5 text-accent" />
        {t('title')}
      </h2>
      <div className="space-y-3">
        {upcoming.map(({ member, days }) => (
          <Link
            key={member.id}
            href={`/family/${familyId}/members/${member.id}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <MemberAvatar name={member.fullName} photoUrl={member.photoUrl} branch={member.familyBranch} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-primary-600 transition-colors">
                {member.fullName}
              </p>
              <p className="text-xs text-gray-400">{formatDateMY(member.birthDate)}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
              days === 0
                ? 'bg-accent/20 text-amber-700'
                : days <= 3
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {getBirthdayLabel(days)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

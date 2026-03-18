import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'
import type { FamilyMember } from '@prisma/client'
import { getTranslations } from 'next-intl/server'
import { MemberAvatar } from '@/components/shared/Avatar'
import { formatDateMY, genderLabel } from '@/lib/utils'

interface RecentMembersProps {
  members: FamilyMember[]
  familyId: string
}

export async function RecentMembers({ members, familyId }: RecentMembersProps) {
  const t = await getTranslations('dashboard')
  const tMember = await getTranslations('member')

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-500" />
          {t('recentMembers')}
        </h2>
        <Link
          href={`/family/${familyId}/members`}
          className="text-xs text-primary-500 font-medium hover:underline flex items-center gap-1"
        >
          {tMember('viewProfile')} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{tMember('noMembers')}</p>
      ) : (
        <div className="space-y-2">
          {members.slice(0, 6).map((member) => (
            <Link
              key={member.id}
              href={`/family/${familyId}/members/${member.id}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <MemberAvatar
                name={member.fullName}
                photoUrl={member.photoUrl}
                branch={member.familyBranch}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-primary-600 transition-colors">
                  {member.generationalTitle ? `${member.generationalTitle} ` : ''}
                  {member.fullName}
                </p>
                <p className="text-xs text-gray-400">
                  {genderLabel(member.gender)}
                  {member.birthDate && ` · ${formatDateMY(member.birthDate)}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

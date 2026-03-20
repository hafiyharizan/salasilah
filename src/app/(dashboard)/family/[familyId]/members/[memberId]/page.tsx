import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MemberAvatar } from '@/components/shared/Avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  formatDateMY, formatYear, getAge, genderLabel,
  religionLabel, getBranchColor
} from '@/lib/utils'
import {
  Edit, MapPin, Calendar, Briefcase, User, Phone, Mail,
  Heart, Baby, Users, GitBranch, BookOpen
} from 'lucide-react'
import AddRelationshipClient from './AddRelationshipClient'
import RemoveRelationshipButton from './RemoveRelationshipButton'
import { AvatarUploadProfile } from './AvatarUploadProfile'

type Params = { familyId: string; memberId: string }
type PageProps = { params: Promise<Params> }

export async function generateMetadata({ params }: PageProps) {
  const { memberId } = await params
  const [member, t] = await Promise.all([
    prisma.familyMember.findUnique({ where: { id: memberId } }),
    getTranslations('member'),
  ])
  return { title: member?.fullName ?? t('personalInfo') }
}

export default async function MemberProfilePage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const { familyId, memberId } = await params

  const [member, t, tMember] = await Promise.all([
    prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
      include: {
        relationshipsAsFrom: { include: { to: true } },
        relationshipsAsTo: { include: { from: true } },
        photos: { orderBy: { createdAt: 'desc' }, take: 12 },
      },
    }),
    getTranslations('member'),
    getTranslations('common'),
  ])

  if (!member) notFound()

  const allMembers = await prisma.familyMember.findMany({
    where: { familyId },
    select: { id: true, fullName: true },
    orderBy: { fullName: 'asc' },
  })

  const parents = member.relationshipsAsFrom.filter((r) => r.type === 'PARENT')
  const children = member.relationshipsAsFrom.filter((r) => r.type === 'CHILD')
  const spouses = member.relationshipsAsFrom.filter((r) => r.type === 'SPOUSE')
  const siblings = member.relationshipsAsFrom.filter((r) => r.type === 'SIBLING')

  const branchColor = getBranchColor(member.familyBranch)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card overflow-hidden">
        <div className="h-32 sm:h-40" style={{ background: `linear-gradient(135deg, ${branchColor}, ${branchColor}99)` }} />

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 sm:-mt-12">
            <div className="flex items-end gap-4">
              <div className="ring-4 ring-white rounded-full">
                <AvatarUploadProfile
                  familyId={familyId}
                  memberId={memberId}
                  currentUrl={member.photoUrl}
                  name={member.fullName}
                  branch={member.familyBranch}
                />
              </div>
              <div className="pb-2">
                {member.generationalTitle && (
                  <p className="text-sm font-medium" style={{ color: branchColor }}>
                    {member.generationalTitle}
                  </p>
                )}
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
                  {member.fullName}
                </h1>
                {member.binBinti && (
                  <p className="text-gray-500 text-sm">
                    {member.gender === 'FEMALE' ? 'binti' : 'bin'} {member.binBinti}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <AddRelationshipClient
                familyId={familyId}
                memberId={memberId}
                allMembers={allMembers}
              />
              <Link href={`/family/${familyId}/members/${memberId}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                  {tMember('edit')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant={member.gender === 'MALE' ? 'default' : 'secondary'}>
              {genderLabel(member.gender)}
            </Badge>
            <Badge variant="muted">{religionLabel(member.religion)}</Badge>
            {member.isDeceased && <Badge variant="outline">Al-Fatihah 🤲</Badge>}
            {member.familyBranch && (
              <Badge style={{ backgroundColor: `${branchColor}20`, color: branchColor }}>
                {member.familyBranch}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Key facts */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold mb-4 text-xs uppercase tracking-wider text-gray-500">
              {t('personalInfo')}
            </h2>
            <dl className="space-y-3">
              {member.birthDate && (
                <InfoRow icon={Calendar} label={t('birthDate')}>
                  {formatDateMY(member.birthDate)}
                  {!member.isDeceased && (
                    <span className="text-xs text-gray-400 ml-1">({getAge(member.birthDate)})</span>
                  )}
                </InfoRow>
              )}
              {member.deathDate && (
                <InfoRow icon={Calendar} label={t('deathDate')}>
                  {formatDateMY(member.deathDate)}
                </InfoRow>
              )}
              {member.placeOfBirth && (
                <InfoRow icon={MapPin} label={t('placeOfBirth')}>{member.placeOfBirth}</InfoRow>
              )}
              {member.currentAddress && (
                <InfoRow icon={MapPin} label={t('currentAddress')}>{member.currentAddress}</InfoRow>
              )}
              {member.negeri && (
                <InfoRow icon={MapPin} label={t('negeri')}>{member.negeri}</InfoRow>
              )}
              {member.occupation && (
                <InfoRow icon={Briefcase} label={t('occupation')}>{member.occupation}</InfoRow>
              )}
              {member.contactPhone && (
                <InfoRow icon={Phone} label={t('contactPhone')}>{member.contactPhone}</InfoRow>
              )}
              {member.contactEmail && (
                <InfoRow icon={Mail} label={t('contactEmail')}>{member.contactEmail}</InfoRow>
              )}
            </dl>
          </div>
        </div>

        {/* Right: Relations + Biography */}
        <div className="lg:col-span-2 space-y-5">
          {/* Family Relations */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">{t('relationships')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {parents.length > 0 && (
                <RelationGroup
                  title={t('parents')}
                  icon={Users}
                  relationships={parents}
                  familyId={familyId}
                  memberId={memberId}
                />
              )}
              {spouses.length > 0 && (
                <RelationGroup
                  title={t('spouse')}
                  icon={Heart}
                  relationships={spouses}
                  familyId={familyId}
                  memberId={memberId}
                />
              )}
              {children.length > 0 && (
                <RelationGroup
                  title={`${t('children')} (${children.length})`}
                  icon={Baby}
                  relationships={children}
                  familyId={familyId}
                  memberId={memberId}
                />
              )}
              {siblings.length > 0 && (
                <RelationGroup
                  title={`${t('siblings')} (${siblings.length})`}
                  icon={Users}
                  relationships={siblings}
                  familyId={familyId}
                  memberId={memberId}
                />
              )}
            </div>
            {parents.length + spouses.length + children.length + siblings.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">{t('noRelationships')}</p>
            )}
          </div>

          {/* Biography */}
          {member.biography && (
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-500" />
                {t('biography')}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {member.biography}
              </p>
            </div>
          )}

          {/* Photo Gallery — hidden while gallery feature is disabled */}
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-800">{children}</p>
      </div>
    </div>
  )
}

// Gender accent colours — matching MemberNode tree design
const GENDER_ACCENT = {
  MALE: { border: '#3B82F6', bg: 'rgba(59,130,246,0.04)', icon: '♂', color: '#3B82F6' },
  FEMALE: { border: '#EC4899', bg: 'rgba(236,72,153,0.04)', icon: '♀', color: '#EC4899' },
  NEUTRAL: { border: '#94A3B8', bg: 'transparent', icon: '⚬', color: '#94A3B8' },
} as const

function RelationGroup({
  title,
  icon: Icon,
  relationships,
  familyId,
  memberId,
}: {
  title: string
  icon: React.ElementType
  relationships: (import('@prisma/client').Relationship & { to: import('@prisma/client').FamilyMember })[]
  familyId: string
  memberId: string
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {title}
      </h3>
      <div className="space-y-2">
        {relationships.map((rel) => {
          const gender = GENDER_ACCENT[rel.to.gender as keyof typeof GENDER_ACCENT] ?? GENDER_ACCENT.NEUTRAL
          const branch = getBranchColor(rel.to.familyBranch)

          return (
            <div
              key={rel.id}
              className="relative flex items-center gap-3 p-2.5 rounded-xl transition-all group hover:shadow-sm"
              style={{
                borderWidth: '1.5px',
                borderStyle: 'solid',
                borderColor: `${gender.border}25`,
                borderLeftColor: gender.border,
                borderLeftWidth: '3px',
                backgroundColor: gender.bg,
              }}
            >
              <Link
                href={`/family/${familyId}/members/${rel.to.id}`}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <MemberAvatar name={rel.to.fullName} photoUrl={rel.to.photoUrl} branch={rel.to.familyBranch} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors truncate leading-tight">
                    {rel.to.fullName}
                  </p>
                  {(rel.to.generationalTitle || rel.to.familyBranch) && (
                    <p className="text-[10px] font-medium truncate mt-0.5" style={{ color: branch }}>
                      {rel.to.generationalTitle || rel.to.familyBranch}
                    </p>
                  )}
                </div>
                {/* Gender + Deceased indicators — matching tree node */}
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium"
                    style={{ backgroundColor: `${gender.color}15`, color: gender.color }}
                  >
                    {gender.icon}
                  </span>
                  {rel.to.isDeceased && (
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px]"
                      title="Al-Fatihah"
                    >
                      🕊
                    </span>
                  )}
                </div>
              </Link>
              <RemoveRelationshipButton
                familyId={familyId}
                fromId={memberId}
                toId={rel.to.id}
                type={rel.type}
                memberName={rel.to.fullName}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

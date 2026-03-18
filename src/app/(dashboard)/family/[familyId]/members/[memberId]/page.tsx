import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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

  const parents = member.relationshipsAsFrom.filter((r) => r.type === 'PARENT').map((r) => r.to)
  const children = member.relationshipsAsFrom.filter((r) => r.type === 'CHILD').map((r) => r.to)
  const spouses = member.relationshipsAsFrom.filter((r) => r.type === 'SPOUSE').map((r) => r.to)
  const siblings = member.relationshipsAsFrom.filter((r) => r.type === 'SIBLING').map((r) => r.to)

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
                <MemberAvatar
                  name={member.fullName}
                  photoUrl={member.photoUrl}
                  branch={member.familyBranch}
                  size="xl"
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
              {member.kampung && (
                <InfoRow icon={MapPin} label={t('kampung')}>{member.kampung}</InfoRow>
              )}
              {member.negeri && (
                <InfoRow icon={MapPin} label={t('negeri')}>{member.negeri}</InfoRow>
              )}
              {member.occupation && (
                <InfoRow icon={Briefcase} label={t('occupation')}>{member.occupation}</InfoRow>
              )}
              {member.icNumber && (
                <InfoRow icon={User} label={t('icNumber')}>{member.icNumber}</InfoRow>
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
                  members={parents}
                  familyId={familyId}
                />
              )}
              {spouses.length > 0 && (
                <RelationGroup
                  title={t('spouse')}
                  icon={Heart}
                  members={spouses}
                  familyId={familyId}
                />
              )}
              {children.length > 0 && (
                <RelationGroup
                  title={`${t('children')} (${children.length})`}
                  icon={Baby}
                  members={children}
                  familyId={familyId}
                />
              )}
              {siblings.length > 0 && (
                <RelationGroup
                  title={`${t('siblings')} (${siblings.length})`}
                  icon={Users}
                  members={siblings}
                  familyId={familyId}
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

          {/* Photo Gallery */}
          {member.photos.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">{t('photo')}</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {member.photos.map((photo) => (
                  <div key={photo.id} className="aspect-square rounded-xl overflow-hidden relative">
                    <Image
                      src={photo.url}
                      alt={photo.caption ?? member.fullName}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="150px"
                    />
                  </div>
                ))}
              </div>
              <Link
                href={`/family/${familyId}/gallery`}
                className="text-xs text-primary-500 font-medium mt-3 inline-block hover:underline"
              >
                {t('viewProfile')} →
              </Link>
            </div>
          )}
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

function RelationGroup({
  title,
  icon: Icon,
  members,
  familyId,
}: {
  title: string
  icon: React.ElementType
  members: import('@prisma/client').FamilyMember[]
  familyId: string
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {title}
      </h3>
      <div className="space-y-1.5">
        {members.map((m) => (
          <Link
            key={m.id}
            href={`/family/${familyId}/members/${m.id}`}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <MemberAvatar name={m.fullName} photoUrl={m.photoUrl} branch={m.familyBranch} size="sm" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors truncate">
              {m.fullName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

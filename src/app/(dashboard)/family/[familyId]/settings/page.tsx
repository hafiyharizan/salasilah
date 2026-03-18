import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { InviteCodeDisplay } from '@/components/shared/InviteCodeDisplay'
import FamilySettingsClient from './FamilySettingsClient'
import InviteFormClient from './InviteFormClient'
import { formatDateMY, roleLabel } from '@/lib/utils'

export const metadata = { title: 'Tetapan Keluarga' }

interface Props {
  params: Promise<{ familyId: string }>
}

export default async function FamilySettingsPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const { familyId } = await params

  const [family, t] = await Promise.all([
    prisma.family.findFirst({
      where: { id: familyId, ownerId: session.user.id },
    }),
    getTranslations('settings.family'),
  ])

  if (!family) notFound()

  const invites = await prisma.invite.findMany({
    where: { familyId },
    include: { sender: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const ROLE_BADGE: Record<string, 'default' | 'secondary' | 'muted'> = {
    OWNER: 'default',
    EDITOR: 'secondary',
    VIEWER: 'muted',
  }

  const STATUS_BADGE: Record<string, 'success' | 'warning' | 'muted'> = {
    ACCEPTED: 'success',
    PENDING: 'warning',
    EXPIRED: 'muted',
  }

  const statusLabels: Record<string, string> = {
    ACCEPTED: t('statusAccepted'),
    PENDING: t('statusPending'),
    EXPIRED: t('statusExpired'),
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <PageHeader title={t('title')} description={family.name} />

      {/* Family Info */}
      <section className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">{t('name')}</h2>
        <FamilySettingsClient family={family} />
      </section>

      {/* Invite Code */}
      <section className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-2">{t('inviteCode')}</h2>
        <p className="text-sm text-gray-500 mb-4">{t('inviteCodeDesc')}</p>
        <InviteCodeDisplay code={family.inviteCode} />
      </section>

      {/* Share Link */}
      <section className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-3">{t('shareLink')}</h2>
        <p className="text-sm text-gray-500 mb-4">{t('shareLinkDesc')}</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={`${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/shared/${family.shareToken}`}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-600"
          />
        </div>
      </section>

      {/* Invitations */}
      <section className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">{t('invites')}</h2>
        <InviteFormClient familyId={familyId} />

        {invites.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('pendingInvites')}</h3>
            <div className="space-y-2">
              {invites.map((invite) => (
                <div key={invite.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{invite.email}</p>
                    <p className="text-xs text-gray-400">
                      {formatDateMY(invite.createdAt)} · {invite.sender.name}
                    </p>
                  </div>
                  <Badge variant={ROLE_BADGE[invite.role] ?? 'muted'}>{roleLabel(invite.role)}</Badge>
                  <Badge variant={STATUS_BADGE[invite.status] ?? 'muted'}>{statusLabels[invite.status] ?? invite.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

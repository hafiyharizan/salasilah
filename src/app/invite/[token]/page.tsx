import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { roleLabel } from '@/lib/utils'
import AcceptInviteClient from './AcceptInviteClient'

interface Props {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params
  const [session, t] = await Promise.all([auth(), getTranslations('invite')])

  const invite = await prisma.invite.findUnique({
    where: { token },
    include: {
      family: { select: { id: true, name: true } },
      sender: { select: { name: true, email: true } },
    },
  })

  // Invalid token
  if (!invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <p className="text-red-600 font-medium mb-4">{t('invalidInvite')}</p>
          <Link href="/" className="text-primary-500 hover:underline text-sm">{t('backHome')}</Link>
        </div>
      </div>
    )
  }

  const isExpired = invite.status === 'EXPIRED' || invite.expiresAt < new Date()
  const isAccepted = invite.status === 'ACCEPTED'

  // Require login — redirect preserving the invite URL
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/invite/${token}`)
  }

  const emailMismatch = invite.email.toLowerCase() !== session.user.email?.toLowerCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary-500 text-center">
            {t('title')}
          </h1>
          <p className="text-gray-500 text-sm text-center mt-1">
            {t('subtitle', { sender: invite.sender.name ?? invite.sender.email, family: invite.family.name })}
          </p>
        </div>

        {/* Invite details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('family')}</span>
            <span className="font-medium text-gray-800">{invite.family.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('role')}</span>
            <span className="font-medium text-gray-800">{roleLabel(invite.role)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('invitedEmail')}</span>
            <span className="font-medium text-gray-800">{invite.email}</span>
          </div>
        </div>

        {/* States */}
        {isAccepted && (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">{t('alreadyAccepted')}</p>
            <Link
              href={`/family/${invite.family.id}`}
              className="text-primary-500 hover:underline text-sm"
            >
              {t('goToFamily')}
            </Link>
          </div>
        )}

        {isExpired && !isAccepted && (
          <p className="text-center text-red-600 font-medium">{t('expired')}</p>
        )}

        {emailMismatch && !isAccepted && !isExpired && (
          <p className="text-center text-red-600 font-medium text-sm">{t('emailMismatch')}</p>
        )}

        {!isExpired && !isAccepted && !emailMismatch && (
          <AcceptInviteClient token={token} />
        )}

        <p className="text-center mt-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-xs">
            {t('backHome')}
          </Link>
        </p>
      </div>
    </div>
  )
}

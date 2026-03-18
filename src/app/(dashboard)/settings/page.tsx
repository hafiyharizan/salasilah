import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { PageHeader } from '@/components/shared/PageHeader'
import AccountSettingsClient from './AccountSettingsClient'

export const metadata = { title: 'Tetapan Akaun' }

export default async function AccountSettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const t = await getTranslations('settings.account')

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title={t('title')} description="" />
      <AccountSettingsClient user={session.user} />
    </div>
  )
}

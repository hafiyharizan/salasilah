import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/shared/PageHeader'
import { MemberForm } from '@/components/members/MemberForm'

interface Props {
  params: Promise<{ familyId: string }>
}

export default async function NewMemberPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const { familyId } = await params

  const [family, t] = await Promise.all([
    prisma.family.findFirst({
      where: { id: familyId, ownerId: session.user.id },
    }),
    getTranslations('member'),
  ])
  if (!family) redirect('/dashboard')

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title={t('addNew')}
        description={t('addNewDesc', { family: family.name })}
      />
      <MemberForm familyId={familyId} />
    </div>
  )
}

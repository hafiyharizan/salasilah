import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/shared/PageHeader'
import { MemberForm } from '@/components/members/MemberForm'

type Params = { familyId: string; memberId: string }
type PageProps = { params: Promise<Params> }

export const metadata = { title: 'Edit Ahli Keluarga' }

export default async function EditMemberPage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const { familyId, memberId } = await params

  const member = await prisma.familyMember.findFirst({
    where: { id: memberId, familyId },
  })
  if (!member) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Edit Maklumat Ahli" description={`Kemaskini maklumat ${member.fullName}`} />
      <MemberForm familyId={familyId} member={member} />
    </div>
  )
}

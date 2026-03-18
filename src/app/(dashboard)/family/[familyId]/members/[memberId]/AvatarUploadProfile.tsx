'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AvatarUpload } from '@/components/members/AvatarUpload'

interface Props {
  familyId: string
  memberId: string
  currentUrl?: string | null
  name: string
  branch?: string | null
}

export function AvatarUploadProfile({ familyId, memberId, currentUrl, name, branch }: Props) {
  const router = useRouter()

  async function handleUploaded(url: string) {
    const res = await fetch(`/api/families/${familyId}/members/${memberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoUrl: url }),
    })

    if (!res.ok) {
      toast.error('Gagal menyimpan gambar profil')
      return
    }

    router.refresh()
  }

  return (
    <AvatarUpload
      memberId={memberId}
      currentUrl={currentUrl}
      name={name}
      branch={branch}
      size="xl"
      onUploaded={handleUploaded}
    />
  )
}

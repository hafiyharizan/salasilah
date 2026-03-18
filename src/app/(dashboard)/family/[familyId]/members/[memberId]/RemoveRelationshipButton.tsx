'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Props {
  familyId: string
  fromId: string
  toId: string
  type: string
  memberName: string
}

export default function RemoveRelationshipButton({ familyId, fromId, toId, type, memberName }: Props) {
  const router = useRouter()
  const t = useTranslations('relationship')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRemove() {
    setLoading(true)
    const res = await fetch(
      `/api/families/${familyId}/relationships?fromId=${fromId}&toId=${toId}&type=${type}`,
      { method: 'DELETE' },
    )
    setLoading(false)

    if (!res.ok) {
      toast.error('Failed to remove relationship')
      return
    }

    // Also remove the inverse relationship
    const inverseType = getInverseType(type)
    if (inverseType) {
      await fetch(
        `/api/families/${familyId}/relationships?fromId=${toId}&toId=${fromId}&type=${inverseType}`,
        { method: 'DELETE' },
      )
    }

    toast.success(t('removeSuccess'))
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
          title={t('remove')}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-4 h-4" />
            {t('removeTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          {t('removeConfirm')}
        </p>
        <p className="text-sm font-medium text-gray-800">{memberName}</p>
        <div className="flex gap-3 justify-end mt-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            {t('remove') === 'Remove' ? 'Cancel' : 'Batal'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {loading ? t('removing') : t('remove')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getInverseType(type: string): string | null {
  switch (type) {
    case 'PARENT': return 'CHILD'
    case 'CHILD': return 'PARENT'
    case 'SPOUSE': return 'SPOUSE'
    case 'SIBLING': return 'SIBLING'
    default: return null
  }
}

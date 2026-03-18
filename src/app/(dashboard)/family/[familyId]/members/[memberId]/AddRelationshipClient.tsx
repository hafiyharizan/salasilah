'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Loader2, GitBranch } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Member {
  id: string
  fullName: string
}

interface Props {
  familyId: string
  memberId: string
  allMembers: Member[]
}

export default function AddRelationshipClient({ familyId, memberId, allMembers }: Props) {
  const router = useRouter()
  const t = useTranslations('relationship')
  const [open, setOpen] = useState(false)
  const [toId, setToId] = useState('')
  const [type, setType] = useState('PARENT')
  const [loading, setLoading] = useState(false)

  const otherMembers = allMembers.filter((m) => m.id !== memberId)

  async function handleAdd() {
    if (!toId) {
      toast.error(t('selectMemberError'))
      return
    }

    setLoading(true)
    const res = await fetch(`/api/families/${familyId}/relationships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromId: memberId, toId, type, bidirectional: true }),
    })
    setLoading(false)

    if (!res.ok) {
      const body = await res.json()
      toast.error(body.error ?? t('selectMemberError'))
      return
    }

    toast.success(t('success'))
    setOpen(false)
    setToId('')
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4" />
          {t('add')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-primary-500" />
            {t('title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('type')}</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PARENT">{t('types.PARENT')}</SelectItem>
                <SelectItem value="CHILD">{t('types.CHILD')}</SelectItem>
                <SelectItem value="SPOUSE">{t('types.SPOUSE')}</SelectItem>
                <SelectItem value="SIBLING">{t('types.SIBLING')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('selectMember')}</label>
            <Select value={toId} onValueChange={setToId}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectMemberPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {otherMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleAdd} disabled={loading || !toId} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? t('adding') : t('add')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

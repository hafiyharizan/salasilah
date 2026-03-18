'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, Loader2, Send, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function InviteFormClient({ familyId }: { familyId: string }) {
  const router = useRouter()
  const t = useTranslations('settings.family')
  const tCommon = useTranslations('common')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('VIEWER')
  const [loading, setLoading] = useState(false)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)

  async function handleInvite() {
    if (!email) return

    setLoading(true)
    try {
      const res = await fetch(`/api/families/${familyId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })
      const body = await res.json()

      if (!res.ok) {
        toast.error(body.error ?? tCommon('error'))
        return
      }

      setInviteUrl(body.inviteUrl)
      setEmail('')
      toast.success(t('inviteSuccess'))
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    if (inviteUrl) {
      await navigator.clipboard.writeText(inviteUrl)
      toast.success(tCommon('copied'))
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('inviteEmailPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
          />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VIEWER">{t('roles.VIEWER')}</SelectItem>
            <SelectItem value="EDITOR">{t('roles.EDITOR')}</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleInvite} disabled={loading || !email} size="sm">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">{t('inviteButton')}</span>
        </Button>
      </div>

      {inviteUrl && (
        <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-xl border border-primary-100">
          <p className="text-xs text-primary-700 font-mono flex-1 truncate">{inviteUrl}</p>
          <button
            onClick={copyLink}
            className="p-1.5 hover:bg-primary-100 rounded-lg transition-colors shrink-0"
          >
            <Copy className="w-3.5 h-3.5 text-primary-600" />
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400">
        {t('inviteExpiresDesc')}
      </p>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function AcceptInviteClient({ token }: { token: string }) {
  const router = useRouter()
  const t = useTranslations('invite')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAccept() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/invite/${token}`, { method: 'POST' })
      const body = await res.json()

      if (!res.ok) {
        setError(body.error ?? t('errorGeneric'))
        return
      }

      router.push(`/family/${body.familyId}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <button
        onClick={handleAccept}
        disabled={loading}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl text-base transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t('accepting')}</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>{t('accept')}</span>
          </>
        )}
      </button>
    </div>
  )
}

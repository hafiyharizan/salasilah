'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Loader2, UserPlus, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FamilyPreview {
  familyName: string
  memberCount: number
  alreadyMember: boolean
}

export function JoinFamilyForm() {
  const router = useRouter()
  const t = useTranslations('dashboard.noFamily')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [preview, setPreview] = useState<FamilyPreview | null>(null)
  const [error, setError] = useState('')

  // Format code as user types: auto-uppercase and insert dash
  function handleCodeChange(value: string) {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    setCode(cleaned)
    setPreview(null)
    setError('')
  }

  // Validate the code and show preview
  const validateCode = useCallback(async (inviteCode: string) => {
    if (inviteCode.length < 4) return

    setValidating(true)
    setError('')
    try {
      const res = await fetch(`/api/families/join?code=${encodeURIComponent(inviteCode)}`)
      if (!res.ok) {
        setError(t('joinErrorInvalid'))
        setPreview(null)
        return
      }
      const data: FamilyPreview = await res.json()
      if (data.alreadyMember) {
        setError(t('joinErrorAlready'))
        setPreview(null)
        return
      }
      setPreview(data)
    } catch {
      setError(t('joinErrorInvalid'))
    } finally {
      setValidating(false)
    }
  }, [t])

  async function handleJoin() {
    if (!code) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/families/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'already-member') {
          setError(t('joinErrorAlready'))
        } else {
          setError(t('joinErrorInvalid'))
        }
        return
      }

      toast.success(t('joinSuccess', { familyName: data.familyName }))
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError(t('joinErrorInvalid'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          onBlur={() => code.length >= 4 && validateCode(code)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (preview) handleJoin()
              else validateCode(code)
            }
          }}
          placeholder={t('inviteCodePlaceholder')}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-base font-mono tracking-wider text-center uppercase focus:outline-none focus:border-primary-500 transition-colors"
        />
        {!preview ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => validateCode(code)}
            disabled={code.length < 4 || validating}
            className="px-4"
          >
            {validating ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleJoin}
            disabled={loading}
            className="px-5 shadow-md shadow-primary-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('joinButton')}
          </Button>
        )}
      </div>

      {/* Preview card */}
      {preview && (
        <div className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-100 rounded-xl animate-fade-in">
          <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary-800">{preview.familyName}</p>
            <p className="text-xs text-primary-600">
              {t('joinPreview', { familyName: preview.familyName, count: preview.memberCount })}
            </p>
          </div>
          <CheckCircle className="w-5 h-5 text-primary-500 shrink-0" />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 text-center animate-fade-in">{error}</p>
      )}
    </div>
  )
}

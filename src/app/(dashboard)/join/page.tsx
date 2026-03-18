'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Loader2, Users, CheckCircle, XCircle, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OnboardingIllustration } from '@/components/shared/EmptyStateIllustration'

interface FamilyPreview {
  familyName: string
  memberCount: number
  alreadyMember: boolean
}

export default function JoinPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('dashboard.noFamily')
  const codeFromUrl = searchParams.get('code') ?? ''

  const [code, setCode] = useState(codeFromUrl)
  const [preview, setPreview] = useState<FamilyPreview | null>(null)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState('')

  // Auto-validate if code comes from URL
  useEffect(() => {
    if (codeFromUrl) {
      validateCode(codeFromUrl)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function validateCode(inviteCode: string) {
    if (inviteCode.length < 4) return
    setValidating(true)
    setError('')
    setPreview(null)

    try {
      const res = await fetch(`/api/families/join?code=${encodeURIComponent(inviteCode)}`)
      if (!res.ok) {
        setError(t('joinErrorInvalid'))
        return
      }
      const data: FamilyPreview = await res.json()
      if (data.alreadyMember) {
        setError(t('joinErrorAlready'))
        return
      }
      setPreview(data)
    } catch {
      setError(t('joinErrorInvalid'))
    } finally {
      setValidating(false)
    }
  }

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
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in-up">
      <OnboardingIllustration className="w-40 h-40 mb-6" />
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        {t('joinTitle')}
      </h1>
      <p className="text-gray-500 max-w-sm mb-8">
        {t('joinDesc')}
      </p>

      <div className="w-full max-w-sm space-y-4">
        {/* Code input */}
        <input
          value={code}
          onChange={(e) => {
            const v = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
            setCode(v)
            setPreview(null)
            setError('')
          }}
          onBlur={() => code.length >= 4 && validateCode(code)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (preview) handleJoin()
              else validateCode(code)
            }
          }}
          placeholder={t('inviteCodePlaceholder')}
          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-xl font-mono tracking-[0.25em] text-center uppercase focus:outline-none focus:border-primary-500 transition-colors"
        />

        {/* Preview card */}
        {preview && (
          <div className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-100 rounded-xl animate-fade-in">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-primary-800">{preview.familyName}</p>
              <p className="text-xs text-primary-600">
                {preview.memberCount} {preview.memberCount === 1 ? 'member' : 'members'}
              </p>
            </div>
            <CheckCircle className="w-5 h-5 text-primary-500 shrink-0" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-fade-in">
            <XCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!preview ? (
            <Button
              onClick={() => validateCode(code)}
              disabled={code.length < 4 || validating}
              className="flex-1 py-3"
            >
              {validating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Verify Code
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleJoin}
              disabled={loading}
              className="flex-1 py-3 shadow-md shadow-primary-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('joining')}
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  {t('joinButton')}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export function InviteCodeDisplay({ code }: { code: string }) {
  const t = useTranslations('settings.family')
  const tCommon = useTranslations('common')
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success(t('codeCopied'))
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-lg tracking-[0.2em] text-center font-semibold text-gray-800 select-all">
        {code}
      </div>
      <button
        onClick={copyCode}
        className="flex items-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium text-sm transition-colors shrink-0"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            {tCommon('copied')}
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            {t('copyCode')}
          </>
        )}
      </button>
    </div>
  )
}

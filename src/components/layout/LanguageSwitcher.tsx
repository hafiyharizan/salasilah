'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchLocale(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5 text-xs font-medium">
      <button
        onClick={() => switchLocale('ms')}
        disabled={isPending}
        className={`rounded-md px-2 py-1 transition-colors ${
          locale === 'ms'
            ? 'bg-primary-700 text-white'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        aria-label="Bahasa Melayu"
      >
        BM
      </button>
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`rounded-md px-2 py-1 transition-colors ${
          locale === 'en'
            ? 'bg-primary-700 text-white'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save, User, Mail, Lock, Globe } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MemberAvatar } from '@/components/shared/Avatar'

interface Props {
  user: {
    id?: string | null
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function AccountSettingsClient({ user }: Props) {
  const t = useTranslations('settings.account')
  const locale = useLocale()
  const router = useRouter()
  const [name, setName] = useState(user.name ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    toast.success(t('saveSuccess'))
    setSaving(false)
  }

  function switchLocale(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">{t('profile')}</h2>
        <div className="flex items-center gap-4">
          <MemberAvatar name={user.name ?? 'User'} photoUrl={user.image} size="xl" />
          <div>
            <p className="text-sm text-gray-600 font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">{t('profile')}</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')}</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              placeholder={t('name')}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input value={user.email ?? ''} disabled className="pl-10 bg-gray-50" />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? t('saving') : t('saveChanges')}
        </Button>
      </div>

      {/* Language */}
      <div className="card p-6 space-y-3">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500" />
          {t('language')}
        </h2>
        <p className="text-sm text-gray-500">{t('languageDesc')}</p>
        <div className="flex gap-2">
          <button
            onClick={() => switchLocale('ms')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              locale === 'ms'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('languages.ms')}
          </button>
          <button
            onClick={() => switchLocale('en')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              locale === 'en'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('languages.en')}
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-gray-500" />
          {t('security')}
        </h2>
        <p className="text-sm text-gray-500">{t('securityNote')}</p>
      </div>
    </div>
  )
}

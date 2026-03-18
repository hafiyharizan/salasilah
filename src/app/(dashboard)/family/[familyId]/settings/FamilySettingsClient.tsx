'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Family } from '@prisma/client'

export default function FamilySettingsClient({ family }: { family: Family }) {
  const router = useRouter()
  const t = useTranslations('settings.family')
  const [name, setName] = useState(family.name)
  const [description, setDescription] = useState(family.description ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/families/${family.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    })
    setSaving(false)
    if (res.ok) {
      toast.success(t('saveSuccess'))
      router.refresh()
    } else {
      toast.error(t('saveError'))
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')}</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('namePlaceholder')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('description')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder={t('descriptionPlaceholder')}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
        />
      </div>
      <Button onClick={handleSave} disabled={saving} size="sm">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? t('saving') : t('saveChanges')}
      </Button>
    </div>
  )
}

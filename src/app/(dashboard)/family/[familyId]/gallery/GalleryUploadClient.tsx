'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Loader2, Upload, X } from 'lucide-react'
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
  members: Member[]
}

export default function GalleryUploadClient({ familyId, members }: Props) {
  const router = useRouter()
  const t = useTranslations('gallery')
  const tCommon = useTranslations('common')
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState('FAMILY')
  const [memberId, setMemberId] = useState('')

  const categories = [
    { value: 'FAMILY', label: t('categories.FAMILY') },
    { value: 'WEDDING', label: t('categories.WEDDING') },
    { value: 'ANCESTRAL', label: t('categories.ANCESTRAL') },
    { value: 'CHILDHOOD', label: t('categories.CHILDHOOD') },
    { value: 'OTHERS', label: t('categories.OTHERS') },
  ]

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleUpload() {
    if (!file) {
      toast.error(t('uploadError'))
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) {
        const body = await uploadRes.json()
        throw new Error(body.error ?? t('uploadError'))
      }
      const { url } = await uploadRes.json()

      const photoRes = await fetch(`/api/families/${familyId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          caption: caption || undefined,
          category,
          memberId: memberId || undefined,
        }),
      })

      if (!photoRes.ok) throw new Error(t('uploadError'))

      toast.success(t('uploadSuccess'))
      setOpen(false)
      setFile(null)
      setPreview(null)
      setCaption('')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tCommon('error'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4" />
          {t('upload')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('upload')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File picker */}
          <label className="block">
            <div className={`
              border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
              ${preview ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'}
            `}>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setFile(null); setPreview(null) }}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">{t('upload')}</p>
                  <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP · Max 5MB</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('caption')} <span className="text-xs text-gray-400">({tCommon('optional')})</span>
            </label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={t('captionPlaceholder')}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('category')}</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tag member */}
          {members.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('tagMember')} <span className="text-xs text-gray-400">({tCommon('optional')})</span>
              </label>
              <Select value={memberId} onValueChange={setMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('tagMemberPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— {tCommon('no')} —</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Submit */}
          <Button onClick={handleUpload} disabled={uploading || !file} className="w-full">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('uploading')}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {t('upload')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

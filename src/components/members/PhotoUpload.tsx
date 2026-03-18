'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Upload, X, Loader2, Camera } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PhotoUploadProps {
  currentUrl?: string | null
  onUpload: (url: string) => void
  shape?: 'circle' | 'square'
}

export function PhotoUpload({ currentUrl, onUpload, shape = 'circle' }: PhotoUploadProps) {
  const t = useTranslations('photo')
  const tCommon = useTranslations('common')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error(t('invalidType'))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('tooLarge'))
      return
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? t('uploadFailed'))
      }
      const { url } = await res.json()
      onUpload(url)
      setPreview(url)
      toast.success(t('uploadSuccess'))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tCommon('error'))
      setPreview(currentUrl ?? null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Preview / Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative overflow-hidden group transition-all',
          shape === 'circle' ? 'w-24 h-24 rounded-full' : 'w-32 h-32 rounded-2xl',
          'border-2 border-dashed border-gray-300 hover:border-primary-500',
          'bg-gray-50 hover:bg-primary-50 flex items-center justify-center'
        )}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover" sizes="128px" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </>
        ) : (
          <div className="text-center p-3">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-primary-500 animate-spin mx-auto" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">{t('clickToUpload')}</p>
              </>
            )}
          </div>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">{t('uploadPhoto')} · JPEG, PNG, WebP · {t('maxSize')}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

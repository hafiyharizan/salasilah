'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getInitials, getBranchColor } from '@/lib/utils'

interface AvatarUploadProps {
  memberId?: string
  currentUrl?: string | null
  name: string
  branch?: string | null
  size?: 'lg' | 'xl'
  onUploaded: (url: string) => void
}

const sizes = {
  lg: { outer: 'w-16 h-16', text: 'text-xl', icon: 'w-4 h-4' },
  xl: { outer: 'w-24 h-24', text: 'text-3xl', icon: 'w-5 h-5' },
}

export function AvatarUpload({
  memberId,
  currentUrl,
  name,
  branch,
  size = 'xl',
  onUploaded,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)

  const { outer, text, icon } = sizes[size]
  const bg = getBranchColor(branch ?? null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side validation
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG or WebP images are allowed')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File too large. Maximum 2 MB.')
      return
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)

    try {
      const fd = new FormData()
      fd.append('file', file)
      if (memberId) fd.append('memberId', memberId)

      const res = await fetch('/api/upload/avatar', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Upload failed')
        setPreview(currentUrl ?? null) // revert preview
        return
      }

      onUploaded(data.url)
      toast.success('Gambar profil dikemaskini')
    } catch {
      toast.error('Upload failed. Please try again.')
      setPreview(currentUrl ?? null)
    } finally {
      setUploading(false)
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`${outer} rounded-full overflow-hidden relative group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:cursor-not-allowed`}
        aria-label="Upload profile picture"
      >
        {/* Avatar */}
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${text} font-bold text-white`}
            style={{ backgroundColor: bg }}
          >
            {getInitials(name)}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          {uploading ? (
            <Loader2 className={`${icon} text-white animate-spin opacity-100`} />
          ) : (
            <Camera className={`${icon} text-white opacity-0 group-hover:opacity-100 transition-opacity`} />
          )}
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}

import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ImageIcon } from 'lucide-react'
import GalleryUploadClient from './GalleryUploadClient'

export const metadata = { title: 'Galeri Foto' }

interface Props {
  params: Promise<{ familyId: string }>
}

export default async function GalleryPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const { familyId } = await params

  const [photos, members, t] = await Promise.all([
    prisma.photo.findMany({
      where: { familyId },
      include: { member: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.familyMember.findMany({
      where: { familyId },
      select: { id: true, fullName: true },
      orderBy: { fullName: 'asc' },
    }),
    getTranslations('gallery'),
  ])

  const categoryLabels: Record<string, string> = {
    FAMILY: t('categories.FAMILY'),
    WEDDING: t('categories.WEDDING'),
    ANCESTRAL: t('categories.ANCESTRAL'),
    CHILDHOOD: t('categories.CHILDHOOD'),
    OTHERS: t('categories.OTHERS'),
  }

  return (
    <div>
      <PageHeader
        title={t('title')}
        description={`${photos.length} foto`}
        action={
          <GalleryUploadClient familyId={familyId} members={members} />
        }
      />

      {photos.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title={t('noPhotos')}
          description={t('noPhotosDesc')}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={photo.url}
                alt={photo.caption ?? t('title')}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col justify-end p-3">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.caption && (
                    <p className="text-white text-xs font-medium truncate mb-0.5">{photo.caption}</p>
                  )}
                  <div className="flex items-center justify-between">
                    {photo.member && (
                      <Link
                        href={`/family/${familyId}/members/${photo.member.id}`}
                        className="text-white/80 text-xs hover:text-white truncate"
                      >
                        {photo.member.fullName}
                      </Link>
                    )}
                    <span className="text-white/60 text-xs shrink-0 ml-auto">
                      {categoryLabels[photo.category] ?? photo.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

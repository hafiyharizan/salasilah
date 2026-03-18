import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { TreePine, ArrowLeft } from 'lucide-react'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <TreePine className="w-10 h-10 text-primary-400" />
        </div>
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">404</h1>
        <h2 className="font-semibold text-xl text-gray-700 mb-3">{t('title')}</h2>
        <p className="text-gray-500 mb-8">{t('desc')}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backHome')}
        </Link>
      </div>
    </div>
  )
}

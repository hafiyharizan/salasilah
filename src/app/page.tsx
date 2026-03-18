import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import {
  TreePine, Users, Globe, Lock, GitBranch,
  Image, Clock, Download, ChevronRight, Star,
  MapPin, Heart, Calendar
} from 'lucide-react'

export const metadata = {
  title: 'Salasilah — Platform Salasilah Keluarga Malaysia',
  description: 'Dokumentasi, visualisasi dan kongsi salasilah keluarga anda. Platform digital warisan keluarga untuk keluarga Malaysia.',
}

export default async function LandingPage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')

  const t = await getTranslations('landing')

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm">
              <TreePine className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-primary-500">Salasilah</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="text-gray-600 hover:text-primary-500 font-medium text-sm hidden sm:block transition-colors">
              {t('nav.login')}
            </Link>
            <Link
              href="/register"
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md hover:shadow-primary-500/10"
            >
              {t('nav.getStarted')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-surface to-white relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute inset-0 heritage-pattern opacity-50" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-100/20 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-primary-100 shadow-sm animate-fade-in">
            <Star className="w-4 h-4 text-accent" />
            {t('hero.badge')}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in-up">
            {t('hero.title')}
            <span className="text-primary-500 block">{t('hero.titleHighlight')}</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <Link
              href="/register"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-500/25"
            >
              {t('hero.getStarted')}
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-bold px-8 py-4 rounded-2xl text-lg transition-all flex items-center justify-center gap-2"
            >
              {t('nav.login')}
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Demo Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-primary-500/15 relative overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z'/%3E%3Cpath d='M30 10L50 30L30 50L10 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }} />

            <div className="relative grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              {[
                { name: 'Tok Ahmad', title: 'Tok' },
                { name: 'Wan Siti', title: 'Wan' },
              ].map((m) => (
                <div key={m.name} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-left border border-white/20 hover:bg-white/20 transition-colors">
                  <div className="w-9 h-9 bg-accent rounded-full mb-2 shadow-sm" />
                  <p className="text-accent text-xs font-bold tracking-wider uppercase">{m.title}</p>
                  <p className="text-white text-sm font-semibold leading-tight mt-0.5">{m.name}</p>
                  <p className="text-white/50 text-xs mt-1">Gen 1</p>
                </div>
              ))}
              <div className="bg-white/5 rounded-2xl border-2 border-dashed border-white/25 p-4 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <span className="text-white/40 text-xs text-center font-medium">+ {t('hero.getStarted')}</span>
              </div>
            </div>
            <p className="text-white/70 text-sm relative">{t('features.tree.desc')}</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: GitBranch, key: 'tree' },
              { icon: Users, key: 'cultural' },
              { icon: Heart, key: 'collaborate' },
              { icon: Image, key: 'gallery' },
              { icon: Clock, key: 'search' },
              { icon: Download, key: 'export' },
            ].map(({ icon: Icon, key }, i) => (
              <div
                key={key}
                className="p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{t(`features.${key}.title` as any)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t(`features.${key}.desc` as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Malaysian Culture Section */}
      <section className="py-20 px-4 bg-surface relative">
        <div className="absolute inset-0 heritage-pattern opacity-40" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            {t('cultural.title')} <span className="inline-block">🇲🇾</span>
          </h2>
          <p className="text-gray-500 mb-10 text-lg">
            {t('cultural.subtitle')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: '👴', key: 'generational' },
              { icon: '🏡', key: 'kampung' },
              { icon: '☪️', key: 'binBinti' },
              { icon: '🌿', key: 'branches' },
              { icon: '📋', key: 'ic' },
              { icon: '🛐', key: 'religion' },
            ].map(({ icon, key }) => (
              <div key={key} className="card p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-2xl block mb-3">{icon}</span>
                <p className="text-xs font-medium text-gray-700 leading-relaxed">{t(`cultural.items.${key}` as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-300/10 rounded-full blur-[100px]" />

        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-primary-200 text-lg mb-10">
            {t('cta.subtitle')}
          </p>
          <Link
            href="/register"
            className="bg-accent hover:bg-accent/90 text-primary-900 font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-xl shadow-accent/20 inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-accent/25"
          >
            {t('cta.button')}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
              <TreePine className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-primary-500">Salasilah</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Salasilah &middot; {t('footer.tagline')}
          </p>
        </div>
      </footer>
    </div>
  )
}

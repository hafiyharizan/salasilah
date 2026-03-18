import type { Metadata } from 'next'
import Link from 'next/link'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

export const metadata: Metadata = {
  title: 'Log Masuk — Salasilah',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex flex-col relative overflow-hidden">
      {/* Subtle decorative geometric pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z'/%3E%3Cpath d='M30 10L50 30L30 50L10 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
      }} />

      {/* Soft radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />

      {/* Header */}
      <header className="relative p-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">
            <span className="text-primary-900 font-bold text-lg font-display">S</span>
          </div>
          <span className="text-white font-display text-xl font-semibold">Salasilah</span>
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative p-6 text-center text-white/50 text-sm z-10">
        &copy; {new Date().getFullYear()} Salasilah &middot; Platform Salasilah Keluarga Malaysia
      </footer>
    </div>
  )
}

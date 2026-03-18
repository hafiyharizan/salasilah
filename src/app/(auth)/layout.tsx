import type { Metadata } from 'next'
import Link from 'next/link'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

export const metadata: Metadata = {
  title: 'Log Masuk — Salasilah',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-primary-900 font-bold text-lg font-display">S</span>
          </div>
          <span className="text-white font-display text-xl font-semibold">Salasilah</span>
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-white/60 text-sm">
        © {new Date().getFullYear()} Salasilah · Platform Salasilah Keluarga Malaysia
      </footer>
    </div>
  )
}

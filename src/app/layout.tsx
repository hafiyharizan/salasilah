import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import SessionProvider from '@/components/providers/SessionProvider'
import { auth } from '@/lib/auth'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Salasilah — Platform Salasilah Keluarga Malaysia',
    template: '%s — Salasilah',
  },
  description:
    'Platform digital warisan keluarga untuk keluarga Malaysia. Dokumentasi, visualisasi dan kongsi salasilah keluarga anda dengan mudah.',
  keywords: ['salasilah', 'family tree', 'keluarga', 'Malaysia', 'pokok keluarga'],
  authors: [{ name: 'Salasilah' }],
  openGraph: {
    title: 'Salasilah — Platform Salasilah Keluarga Malaysia',
    description: 'Platform digital warisan keluarga untuk keluarga Malaysia.',
    type: 'website',
    locale: 'ms_MY',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B4332',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider session={session}>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  fontFamily: 'var(--font-inter)',
                },
              }}
            />
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

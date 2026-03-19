'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import {
  X,
  LayoutDashboard,
  GitBranch,
  Users,
  Clock,
  Settings,
  LogOut,
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from './LanguageSwitcher'
import { SalasilahLogo } from '@/components/brand/SalasilahLogo'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  familyId?: string
  familyName?: string
}

export function MobileNav({ isOpen, onClose, familyId, familyName }: MobileNavProps) {
  const pathname = usePathname()
  const t = useTranslations('nav')

  // Close on route change
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-72 bg-primary-500 z-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-5 border-b border-primary-400/40 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="min-w-0">
              <SalasilahLogo tone="inverse" className="gap-3" emblemClassName="h-9 w-9" textClassName="text-lg" />
              {familyName && <p className="mt-1 text-primary-300 text-xs truncate max-w-[150px]">{familyName}</p>}
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-primary-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <MobileNavLink href="/dashboard" icon={LayoutDashboard} label={t('dashboard')} active={pathname === '/dashboard'} />

          {familyId && (
            <>
              <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider px-3 pt-4 pb-1">
                {familyName ?? 'Keluarga'}
              </p>
              <MobileNavLink href={`/family/${familyId}`} icon={GitBranch} label={t('familyTree')} active={pathname === `/family/${familyId}`} />
              <MobileNavLink href={`/family/${familyId}/members`} icon={Users} label={t('members')} active={pathname.startsWith(`/family/${familyId}/members`)} />
              {/* Gallery temporarily disabled
              <MobileNavLink href={`/family/${familyId}/gallery`} icon={Image} label={t('gallery')} active={pathname.startsWith(`/family/${familyId}/gallery`)} />
              */}
              <MobileNavLink href={`/family/${familyId}/map`} icon={MapPin} label={t('map')} active={pathname.startsWith(`/family/${familyId}/map`)} />
              <MobileNavLink href={`/family/${familyId}/timeline`} icon={Clock} label={t('timeline')} active={pathname.startsWith(`/family/${familyId}/timeline`)} />
              <MobileNavLink href={`/family/${familyId}/settings`} icon={Settings} label={t('settings')} active={pathname.startsWith(`/family/${familyId}/settings`)} />
            </>
          )}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-primary-400/40 space-y-2">
          <div className="px-3">
            <LanguageSwitcher />
          </div>
          <MobileNavLink href="/settings" icon={Settings} label={t('accountSettings')} active={pathname === '/settings'} />
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-primary-200 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('signOut')}</span>
          </button>
        </div>
      </div>
    </>
  )
}

function MobileNavLink({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium',
        active ? 'bg-white/20 text-white' : 'text-primary-200 hover:bg-white/10 hover:text-white'
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{label}</span>
    </Link>
  )
}

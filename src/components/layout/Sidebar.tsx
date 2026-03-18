'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  GitBranch,
  Users,
  Clock,
  Settings,
  LogOut,
  TreePine,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  familyId?: string
  familyName?: string
}

export function Sidebar({ familyId, familyName }: SidebarProps) {
  const pathname = usePathname()
  const t = useTranslations('nav')

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-primary-500 to-primary-600 flex flex-col z-30 shadow-xl hidden lg:flex">
      {/* Logo */}
      <div className="p-6 border-b border-primary-400/30">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-accent/20 group-hover:scale-105 transition-transform">
            <TreePine className="w-5 h-5 text-primary-900" />
          </div>
          <div>
            <span className="text-white font-display text-lg font-semibold leading-tight">Salasilah</span>
            {familyName && (
              <p className="text-primary-300 text-xs truncate max-w-[140px]">{familyName}</p>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink href="/dashboard" icon={LayoutDashboard} label={t('dashboard')} active={pathname === '/dashboard'} />

        {familyId && (
          <>
            <div className="pt-5 pb-2">
              <p className="text-primary-300/80 text-[10px] font-bold uppercase tracking-[0.15em] px-3">
                {familyName ?? 'Keluarga'}
              </p>
            </div>
            <NavLink
              href={`/family/${familyId}`}
              icon={GitBranch}
              label={t('familyTree')}
              active={pathname === `/family/${familyId}`}
            />
            <NavLink
              href={`/family/${familyId}/members`}
              icon={Users}
              label={t('members')}
              active={pathname.startsWith(`/family/${familyId}/members`)}
            />
            {/* Gallery temporarily disabled */}
            <NavLink
              href={`/family/${familyId}/timeline`}
              icon={Clock}
              label={t('timeline')}
              active={pathname.startsWith(`/family/${familyId}/timeline`)}
            />
            <NavLink
              href={`/family/${familyId}/settings`}
              icon={Settings}
              label={t('settings')}
              active={pathname.startsWith(`/family/${familyId}/settings`)}
            />
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-primary-400/30 space-y-1">
        <NavLink href="/settings" icon={Settings} label={t('accountSettings')} active={pathname === '/settings'} />
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-primary-200 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>{t('signOut')}</span>
        </button>
      </div>
    </aside>
  )
}

interface NavLinkProps {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
}

function NavLink({ href, icon: Icon, label, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative',
        active
          ? 'bg-white/20 text-white shadow-sm'
          : 'text-primary-200 hover:bg-white/10 hover:text-white'
      )}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-full" />
      )}
      <Icon className={cn('w-5 h-5 shrink-0', active && 'text-accent')} />
      <span>{label}</span>
    </Link>
  )
}

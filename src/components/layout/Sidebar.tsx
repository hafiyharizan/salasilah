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
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SalasilahLogo } from '@/components/brand/SalasilahLogo'

interface SidebarProps {
  familyId?: string
  familyName?: string
}

export function Sidebar({ familyId, familyName }: SidebarProps) {
  const pathname = usePathname()
  const t = useTranslations('nav')

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-primary-500 flex flex-col z-30 shadow-xl hidden lg:flex">
      {/* Logo */}
      <div className="p-6 border-b border-primary-400/40">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="min-w-0">
            <SalasilahLogo
              tone="inverse"
              className="gap-3"
              emblemClassName="h-9 w-9"
              textClassName="text-lg"
            />
            {familyName && (
              <p className="mt-1 text-primary-300 text-xs truncate max-w-[160px]">{familyName}</p>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink href="/dashboard" icon={LayoutDashboard} label={t('dashboard')} active={pathname === '/dashboard'} />

        {familyId && (
          <>
            <div className="pt-4 pb-1">
              <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider px-3">
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
            {/* Gallery temporarily disabled
            <NavLink
              href={`/family/${familyId}/gallery`}
              icon={Image}
              label={t('gallery')}
              active={pathname.startsWith(`/family/${familyId}/gallery`)}
            />
            */}
            <NavLink
              href={`/family/${familyId}/map`}
              icon={MapPin}
              label={t('map')}
              active={pathname.startsWith(`/family/${familyId}/map`)}
            />
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
      <div className="p-4 border-t border-primary-400/40 space-y-1">
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
        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium',
        active
          ? 'bg-white/20 text-white'
          : 'text-primary-200 hover:bg-white/10 hover:text-white'
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{label}</span>
    </Link>
  )
}

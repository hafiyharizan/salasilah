'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { MobileNav } from '@/components/layout/MobileNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const params = useParams()
  const familyId = params?.familyId as string | undefined

  const handleMobileNavClose = useCallback(() => setMobileNavOpen(false), [])
  const handleMenuOpen = useCallback(() => setMobileNavOpen(true), [])

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop Sidebar */}
      <Sidebar familyId={familyId} />

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={handleMobileNavClose}
        familyId={familyId}
      />

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar onMenuOpen={handleMenuOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

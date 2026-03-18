'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  illustration?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, illustration, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn('flex flex-col items-center justify-center py-16 px-8 text-center', className)}
    >
      {illustration ? (
        <div className="mb-6">{illustration}</div>
      ) : Icon ? (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-5 shadow-sm">
          <Icon className="w-8 h-8 text-primary-400" />
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">{description}</p>}
      {action}
    </motion.div>
  )
}

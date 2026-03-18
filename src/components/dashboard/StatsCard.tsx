'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: 'green' | 'gold' | 'blue' | 'purple'
  trend?: string
  index?: number
}

const colorMap = {
  green: {
    bg: 'bg-primary-50/50',
    icon: 'bg-primary-500 text-white shadow-md shadow-primary-500/20',
    value: 'text-primary-600',
    ring: 'ring-primary-100',
  },
  gold: {
    bg: 'bg-amber-50/50',
    icon: 'bg-accent text-white shadow-md shadow-accent/20',
    value: 'text-amber-700',
    ring: 'ring-amber-100',
  },
  blue: {
    bg: 'bg-blue-50/50',
    icon: 'bg-blue-500 text-white shadow-md shadow-blue-500/20',
    value: 'text-blue-600',
    ring: 'ring-blue-100',
  },
  purple: {
    bg: 'bg-purple-50/50',
    icon: 'bg-purple-500 text-white shadow-md shadow-purple-500/20',
    value: 'text-purple-600',
    ring: 'ring-purple-100',
  },
}

export function StatsCard({ title, value, subtitle, icon: Icon, color = 'green', trend, index = 0 }: StatsCardProps) {
  const colors = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn('card p-6 flex items-start gap-4 hover:shadow-md transition-shadow duration-300', colors.bg)}
    >
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', colors.icon)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className={cn('text-3xl font-bold mt-0.5 tracking-tight', colors.value)}>{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {trend && <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>}
      </div>
    </motion.div>
  )
}

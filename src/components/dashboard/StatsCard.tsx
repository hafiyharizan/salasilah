import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: 'green' | 'gold' | 'blue' | 'purple'
  trend?: string
}

const colorMap = {
  green: {
    bg: 'bg-primary-50',
    icon: 'bg-primary-500 text-white',
    value: 'text-primary-600',
  },
  gold: {
    bg: 'bg-amber-50',
    icon: 'bg-accent text-white',
    value: 'text-amber-700',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500 text-white',
    value: 'text-blue-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500 text-white',
    value: 'text-purple-600',
  },
}

export function StatsCard({ title, value, subtitle, icon: Icon, color = 'green', trend }: StatsCardProps) {
  const colors = colorMap[color]

  return (
    <div className={cn('card p-6 flex items-start gap-4', colors.bg, 'bg-opacity-30')}>
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', colors.icon)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className={cn('text-3xl font-bold mt-0.5', colors.value)}>{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {trend && <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>}
      </div>
    </div>
  )
}

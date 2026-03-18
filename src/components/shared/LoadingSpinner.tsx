import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  const sizeClass = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  const dotSize = { sm: 'w-1 h-1', md: 'w-1.5 h-1.5', lg: 'w-2 h-2' }[size]

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {/* Heritage-inspired spinner: rotating dots in a circle */}
      <div className={cn('relative', sizeClass)}>
        <div className={cn('absolute inset-0 rounded-full border-2 border-primary-100', sizeClass)} />
        <div
          className={cn('absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin', sizeClass)}
        />
        <div className={cn('absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 rounded-full bg-accent', dotSize)} />
      </div>
      {label && <p className="text-sm text-gray-500 animate-pulse-soft">{label}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  )
}

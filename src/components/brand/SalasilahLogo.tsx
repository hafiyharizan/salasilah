import { cn } from '@/lib/utils'

type LogoVariant = 'horizontal' | 'vertical' | 'icon'
type LogoTone = 'default' | 'inverse'

interface SalasilahLogoProps {
  className?: string
  emblemClassName?: string
  textClassName?: string
  showTagline?: boolean
  tone?: LogoTone
  variant?: LogoVariant
}

function LogoEmblem({
  className,
  tone = 'default',
}: {
  className?: string
  tone?: LogoTone
}) {
  const branch = tone === 'inverse' ? '#F5C96A' : '#1B4332'
  const legacy = tone === 'inverse' ? '#F3D98A' : '#D4A017'
  const panel = tone === 'inverse' ? 'rgba(255,255,255,0.14)' : '#F7F4EE'

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn('h-10 w-10 shrink-0', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="60" height="60" rx="18" fill={panel} />
      <path d="M32 14V23" stroke={branch} strokeWidth="2.75" strokeLinecap="round" />
      <path
        d="M32 23C32 28 27.8 32 22.6 32C17.4 32 13.2 28 13.2 23"
        stroke={branch}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 23C32 28 36.2 32 41.4 32C46.6 32 50.8 28 50.8 23"
        stroke={branch}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22.6 32V40" stroke={branch} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M41.4 32V40" stroke={branch} strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M22.6 40C22.6 44.4 18.9 48 14.6 48"
        stroke={legacy}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41.4 40C41.4 44.4 45.1 48 49.4 48"
        stroke={legacy}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="11" r="4.5" fill={branch} />
      <circle cx="13" cy="23" r="4" fill={legacy} />
      <circle cx="51" cy="23" r="4" fill={legacy} />
      <circle cx="22.6" cy="43" r="3.5" fill={branch} />
      <circle cx="41.4" cy="43" r="3.5" fill={branch} />
      <circle cx="14.6" cy="48" r="2.75" fill={legacy} />
      <circle cx="49.4" cy="48" r="2.75" fill={legacy} />
    </svg>
  )
}

function Wordmark({
  className,
  tone = 'default',
  showTagline = false,
}: {
  className?: string
  tone?: LogoTone
  showTagline?: boolean
}) {
  const primaryText = tone === 'inverse' ? 'text-white' : 'text-primary-500'
  const secondaryText = tone === 'inverse' ? 'text-primary-200' : 'text-gray-500'

  return (
    <div className="min-w-0">
      <div
        className={cn(
          'font-display text-[1.45rem] font-semibold leading-none tracking-[0.01em]',
          primaryText,
          className
        )}
      >
        Salasilah
      </div>
      {showTagline && (
        <div className={cn('mt-1 text-[0.68rem] font-medium uppercase tracking-[0.28em]', secondaryText)}>
          Heritage in every branch
        </div>
      )}
    </div>
  )
}

export function SalasilahLogo({
  className,
  emblemClassName,
  textClassName,
  showTagline = false,
  tone = 'default',
  variant = 'horizontal',
}: SalasilahLogoProps) {
  if (variant === 'icon') {
    return <LogoEmblem className={className} tone={tone} />
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('inline-flex flex-col items-center gap-3 text-center', className)}>
        <LogoEmblem className={cn('h-14 w-14', emblemClassName)} tone={tone} />
        <Wordmark className={textClassName} tone={tone} showTagline={showTagline} />
      </div>
    )
  }

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <LogoEmblem className={emblemClassName} tone={tone} />
      <Wordmark className={textClassName} tone={tone} showTagline={showTagline} />
    </div>
  )
}

import Image from 'next/image'
import { cn, getInitials, getBranchColor } from '@/lib/utils'

interface MemberAvatarProps {
  name: string
  photoUrl?: string | null
  branch?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-14 h-14', text: 'text-lg' },
  xl: { container: 'w-20 h-20', text: 'text-2xl' },
}

export function MemberAvatar({ name, photoUrl, branch, size = 'md', className }: MemberAvatarProps) {
  const { container, text } = sizeMap[size]
  const bgColor = getBranchColor(branch)
  const initials = getInitials(name)

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center font-semibold text-white shrink-0',
        container,
        className
      )}
      style={{ backgroundColor: bgColor }}
    >
      {photoUrl ? (
        <Image src={photoUrl} alt={name} fill className="object-cover" sizes="80px" />
      ) : (
        <span className={text}>{initials}</span>
      )}
    </div>
  )
}

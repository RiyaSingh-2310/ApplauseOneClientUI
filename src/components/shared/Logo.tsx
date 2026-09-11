import { Link } from 'react-router-dom'
import brandLogo from '@/assets/logo/applause-one.png'
import { cn } from '@/lib/utils'

interface LogoProps {
  to?: string
  inverted?: boolean
  compact?: boolean
  className?: string
}

export function Logo({ to = '/', inverted = false, compact = false, className }: LogoProps) {
  return (
    <Link
      to={to}
      className={cn('inline-flex max-w-[min(100%,220px)] items-center', inverted && 'rounded-lg bg-white px-2 py-1.5', className)}
      aria-label="Applause One home"
    >
      <img
        src={brandLogo}
        alt="Applause One"
        className={cn('h-8 w-auto object-contain object-left sm:h-9', compact && 'h-7 sm:h-8')}
      />
    </Link>
  )
}

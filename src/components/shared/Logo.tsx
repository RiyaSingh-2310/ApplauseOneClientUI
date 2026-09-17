import { Link } from 'react-router-dom'
import brandLogo from '@/assets/logo/logo_main.png'
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
      className={cn('inline-flex max-w-[min(100%,280px)] items-center', inverted && 'rounded-lg bg-white px-2 py-1.5', className)}
      aria-label="Applause One home"
    >
      <img
        src={brandLogo}
        alt="Applause One"
        className={cn('h-11 w-auto object-contain object-left sm:h-12', compact && 'h-9 sm:h-10')}
      />
    </Link>
  )
}

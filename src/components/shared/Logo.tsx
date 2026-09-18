import { Link } from 'react-router-dom'
import brandLogo from '@/assets/logo/logo_main.png'
import footerLogo from '@/assets/logo/logo_footer.png'
import { cn } from '@/lib/utils'

interface LogoProps {
  to?: string
  inverted?: boolean
  compact?: boolean
  /** Use the dark-footer asset. Does not affect the header logo. */
  variant?: 'default' | 'footer'
  className?: string
}

export function Logo({
  to = '/',
  inverted = false,
  compact = false,
  variant = 'default',
  className,
}: LogoProps) {
  const isFooter = variant === 'footer'
  const src = isFooter ? footerLogo : brandLogo

  return (
    <Link
      to={to}
      className={cn(
        'inline-flex max-w-[min(100%,320px)] items-center',
        inverted && !isFooter && 'rounded-lg bg-white px-2 py-1.5',
        className,
      )}
      aria-label="Applause One home"
    >
      <img
        src={src}
        alt="Applause One"
        className={cn(
          'h-15 w-auto object-contain object-left sm:h-16',
          compact && 'h-8 sm:h-10',
          isFooter && 'h-10 sm:h-12',
        )}
      />
    </Link>
  )
}

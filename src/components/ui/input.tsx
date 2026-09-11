import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, type = 'text', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.8)] transition-colors placeholder:text-muted/80 focus-visible:border-teal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/10 aria-invalid:border-danger aria-invalid:ring-4 aria-invalid:ring-danger/10 disabled:cursor-not-allowed disabled:bg-paper/80',
        className,
      )}
      {...props}
    />
  )
}

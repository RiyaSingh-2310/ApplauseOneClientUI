import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-teal text-white shadow-soft hover:bg-teal-deep motion-safe:hover:-translate-y-px',
        gold: 'bg-gold text-ink shadow-soft hover:bg-gold-deep hover:text-white motion-safe:hover:-translate-y-px',
        outline: 'border border-line bg-white text-ink hover:border-teal/40 hover:bg-teal-soft/60',
        ghost: 'text-ink-soft hover:bg-teal-soft/70 hover:text-ink',
        subtle: 'bg-ink text-cream hover:bg-ink-soft',
        danger: 'bg-danger text-white hover:bg-danger/90',
        link: 'rounded-none px-0 text-teal underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-3.5 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

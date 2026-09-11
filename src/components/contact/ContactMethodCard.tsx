import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { cardLiftClass } from '@/lib/motion'
import { cn } from '@/lib/utils'

const icons = {
  mail: Mail,
  chat: MessageCircle,
  phone: Phone,
  map: MapPin,
}

export function ContactMethodCard({
  title,
  copy,
  detail,
  cta,
  href,
  icon,
  onAction,
  accent,
}: {
  title: string
  copy: string
  detail: string
  cta: string
  href?: string | null
  icon: keyof typeof icons
  onAction?: () => void
  accent?: boolean
}) {
  const Icon = icons[icon]
  const className = cn(
    'group flex h-full w-full flex-col rounded-[1.6rem] border border-line bg-white p-6 text-center shadow-card',
    cardLiftClass,
    accent && 'border-teal/20 bg-teal-soft/30',
  )

  const action = (
    <span
      className={cn(
        'mt-5 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium',
        accent ? 'border border-teal bg-teal text-white' : 'border border-line bg-white text-ink',
      )}
    >
      {cta}
    </span>
  )

  const body = (
    <>
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-teal-soft text-teal transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-5 font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft">{copy}</p>
      <p className={cn('mt-4 text-sm font-medium break-words', icon === 'chat' ? 'text-success' : 'text-ink')}>{detail}</p>
      {action}
    </>
  )

  if (href) {
    return (
      <a href={href} className={className} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
        {body}
      </a>
    )
  }

  return (
    <button type="button" className={className} onClick={onAction}>
      {body}
    </button>
  )
}

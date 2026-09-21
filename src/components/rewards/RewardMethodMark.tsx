import { cn } from '@/lib/utils'
import type { RewardMethod } from '@/content/rewardMethods'

export function RewardMethodMark({
  method,
  size = 'md',
  className,
}: {
  method: Pick<RewardMethod, 'name' | 'image'>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClass =
    size === 'sm' ? 'size-7 rounded-lg' : size === 'lg' ? 'size-12 rounded-2xl' : 'size-9 rounded-xl'

  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center overflow-hidden border border-line/70 bg-white shadow-soft',
        sizeClass,
        className,
      )}
    >
      <img src={method.image} alt="" className="size-full object-cover" aria-hidden />
      <span className="sr-only">{method.name}</span>
    </span>
  )
}

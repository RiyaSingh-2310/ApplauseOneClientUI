import { registerSteps } from '@/lib/validation'
import { cn } from '@/lib/utils'

export function RegistrationProgress({
  step,
  onSelect,
}: {
  step: number
  onSelect: (index: number) => void
}) {
  const progress = ((step + 1) / registerSteps.length) * 100

  return (
    <div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className="h-full rounded-full bg-teal transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>
      <ol className="mt-4 grid grid-cols-6 gap-1 sm:gap-2" aria-label="Registration progress, 6 steps">
        {registerSteps.map((item) => {
          const current = item.id === step
          const complete = item.id < step
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                disabled={item.id > step}
                className={cn(
                  'flex w-full flex-col items-center gap-1 rounded-xl px-0.5 py-1 text-center text-[10px] sm:px-1 sm:text-xs',
                  current && 'font-semibold text-teal',
                  complete && 'text-ink',
                  !current && !complete && 'text-muted',
                )}
                aria-current={current ? 'step' : undefined}
              >
                <span
                  className={cn(
                    'grid size-7 place-items-center rounded-full border text-[11px]',
                    current && 'border-teal bg-teal text-white',
                    complete && 'border-teal bg-teal-soft text-teal',
                    !current && !complete && 'border-line bg-white',
                  )}
                >
                  {item.id + 1}
                </span>
                <span className="leading-tight">{item.title}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

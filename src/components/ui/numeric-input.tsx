import type { InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'
import { sanitizeNumericInput } from '@/lib/numeric'
import { cn } from '@/lib/utils'

type NumericInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> & {
  value: string | number
  onValueChange: (value: string) => void
  integer?: boolean
  maxDigits?: number
  decimalPlaces?: number
}

export function NumericInput({
  value,
  onValueChange,
  integer = false,
  maxDigits,
  decimalPlaces = 2,
  className,
  onKeyDown,
  onWheel,
  ...props
}: NumericInputProps) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      autoComplete={props.autoComplete ?? 'off'}
      value={String(value)}
      className={cn('[appearance:textfield]', className)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') event.preventDefault()
        onKeyDown?.(event)
      }}
      onWheel={(event) => {
        event.currentTarget.blur()
        onWheel?.(event)
      }}
      onChange={(event) => {
        onValueChange(
          sanitizeNumericInput(event.target.value, {
            integer,
            maxDigits,
            decimalPlaces,
          }),
        )
      }}
    />
  )
}

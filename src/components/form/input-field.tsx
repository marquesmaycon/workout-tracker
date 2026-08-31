import type { ComponentProps } from 'react'

import { useFieldContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

type InputFieldProps = ComponentProps<typeof Input> & {
  mask?: (value: string) => string
  label: string
}

export function InputField({ label, mask, ...props }: InputFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={({ target: { value } }) => field.handleChange(mask ? mask(value) : value)}
        aria-invalid={isInvalid}
        className={cn('bg-background')}
        {...props}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

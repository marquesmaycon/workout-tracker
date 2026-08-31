import type { ComponentProps } from 'react'

import { useFieldContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

import { Field, FieldError, FieldLabel } from '../ui/field'
import { Textarea } from '../ui/textarea'

type TextareaFieldProps = ComponentProps<typeof Textarea> & {
  label: string
}

export function TextareaField({ label, ...props }: TextareaFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={({ target: { value } }) => field.handleChange(value)}
        aria-invalid={isInvalid}
        className={cn('bg-background')}
        {...props}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

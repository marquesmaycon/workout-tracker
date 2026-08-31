import type { ComponentProps } from 'react'

import { useFieldContext } from '@/hooks/form-context'

import { Checkbox } from '../ui/checkbox'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'

type CheckboxFieldProps = ComponentProps<typeof Checkbox> & {
  label: string
  description?: string
}

export function CheckboxField({ label, description, ...props }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field key={field.name} orientation="horizontal" data-invalid={isInvalid}>
      <Checkbox
        id={field.name}
        name={field.name}
        aria-invalid={isInvalid}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        {...props}
      />
      <div className="grid gap-1">
        <FieldLabel htmlFor={field.name} className="font-normal">
          {label}
        </FieldLabel>
        <FieldDescription>{description}</FieldDescription>
        {true && <FieldError errors={field.state.meta.errors} />}
      </div>
    </Field>
  )
}

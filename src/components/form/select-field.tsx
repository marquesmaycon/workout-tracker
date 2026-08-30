import type { ComponentProps } from 'react'

import { useFieldContext } from '#/hooks/form-context'
import { cn } from '#/lib/utils'

import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

type SelectFieldOption = {
  label: string
  value: string
}

type SelectFieldProps = Omit<ComponentProps<typeof Select>, 'children' | 'onValueChange'> & {
  label: string
  options: SelectFieldOption[]
  placeholder?: string
  triggerClassName?: string
  description?: string
}

export function SelectField({
  label,
  options,
  placeholder,
  triggerClassName,
  description,
  ...props
}: SelectFieldProps) {
  const field = useFieldContext<string | null>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        items={options}
        name={field.name}
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v === '' ? null : String(v))}
        {...props}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={isInvalid}
          className={cn('bg-background h-10 w-full', triggerClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldDescription>{description}</FieldDescription>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

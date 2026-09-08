import { useFieldContext } from '@/hooks/form-context'

import { Checkbox } from '../ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../ui/field'

type CheckboxGroupOption<TValue> = {
  label: string
  value: TValue
}

type CheckboxGroupFieldProps<TValue> = {
  label: string
  description?: string
  options: CheckboxGroupOption<TValue>[]
  className?: string
  sort?: (a: TValue, b: TValue) => number
}

export function CheckboxGroupField<TValue extends string | number>({
  label,
  description,
  options,
  className = 'grid grid-cols-2 gap-3 sm:grid-cols-4',
  sort,
}: CheckboxGroupFieldProps<TValue>) {
  const field = useFieldContext<TValue[]>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldSet>
      <FieldLegend variant="label">{label}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldGroup data-slot="checkbox-group" className={className}>
        {options.map((option) => {
          const id = `${field.name}-${option.value}`
          const checked = field.state.value.includes(option.value)
          return (
            <Field key={id} orientation="horizontal" data-invalid={isInvalid}>
              <Checkbox
                id={id}
                name={field.name}
                aria-invalid={isInvalid}
                checked={checked}
                onCheckedChange={(isChecked) => {
                  const next = isChecked
                    ? [...field.state.value, option.value]
                    : field.state.value.filter(
                        (value) => value !== option.value,
                      )
                  field.handleChange(sort ? next.sort(sort) : next)
                }}
              />
              <FieldLabel htmlFor={id} className="font-normal">
                {option.label}
              </FieldLabel>
            </Field>
          )
        })}
      </FieldGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  )
}

import { MinusIcon, PlusIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

import { useFieldContext } from '@/hooks/form-context'

import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group'

type StepperFieldProps = Omit<ComponentProps<typeof InputGroupInput>, 'onChange' | 'value'> & {
  mask?: (value: string) => string
  label: string
  step: number
  description?: string
}

export function StepperField({ label, mask, step, description, ...props }: StepperFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const adjust = (delta: number) => {
    const current = Number.parseFloat(field.state.value) || 0
    const next = Math.max(0, Math.round((current + delta) * 100) / 100)
    field.handleChange(next.toString())
  }

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputGroup className="bg-background">
        <InputGroupAddon align="inline-start">
          <InputGroupButton aria-label={`Diminuir ${step}`} onClick={() => adjust(-step)}>
            <MinusIcon />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={({ target: { value } }) => field.handleChange(mask ? mask(value) : value)}
          aria-invalid={isInvalid}
          className="text-center"
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label={`Aumentar ${step}`} onClick={() => adjust(step)}>
            <PlusIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

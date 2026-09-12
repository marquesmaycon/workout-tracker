import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

import {
  type BodyWeight,
  createBodyWeightSchema,
} from './body-weight.entity'

export type BodyWeightFormSchema = z.infer<typeof createBodyWeightSchema>

export const bodyWeightFormDefaultValues: BodyWeightFormSchema = {
  measuredAt: toDateTimeLocalValue(new Date()),
  weight: '',
  notes: '',
}

export const bodyWeightFormOptions = (bodyWeight?: BodyWeight) => {
  return formOptions({
    defaultValues: bodyWeight
      ? {
          measuredAt: toDateTimeLocalValue(bodyWeight.measuredAt),
          weight: String(bodyWeight.weight),
          notes: bodyWeight.notes ?? '',
        }
      : bodyWeightFormDefaultValues,
    validators: { onSubmit: createBodyWeightSchema },
  })
}

function toDateTimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60_000)

  return localDate.toISOString().slice(0, 16)
}

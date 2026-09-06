import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

const requiredDecimalString = z
  .string()
  .min(1)
  .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0)

export const bodyWeightSchema = z.object({
  id: z.string(),
  userId: z.string(),
  measuredAt: z.date(),
  weight: z.string(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type BodyWeight = z.infer<typeof bodyWeightSchema>

export const createBodyWeightSchema = z.object({
  measuredAt: z.string().min(1),
  weight: requiredDecimalString,
  notes: z.string().optional(),
})

export const updateBodyWeightSchema = createBodyWeightSchema.extend({
  id: z.string(),
})

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

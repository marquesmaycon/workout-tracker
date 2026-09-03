import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

import type { MuscleGroup } from '../../../../prisma/generated/client'

export const muscleGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<MuscleGroup>

export const createMuscleGroupSchema = muscleGroupSchema.pick({ name: true })

export const updateMuscleGroupSchema = muscleGroupSchema
  .pick({ id: true })
  .extend(createMuscleGroupSchema.shape)

export type MuscleGroupFormSchema = z.infer<typeof createMuscleGroupSchema>

export const muscleGroupFormDefaultValues: MuscleGroupFormSchema = {
  name: '',
}

export const muscleGroupFormOptions = (muscleGroup?: MuscleGroup) => {
  return formOptions({
    defaultValues: muscleGroup ?? muscleGroupFormDefaultValues,
    validators: { onSubmit: createMuscleGroupSchema },
  })
}

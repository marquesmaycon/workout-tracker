import { z } from 'zod'
import { formOptions } from '@tanstack/react-form'
import type { MuscleGroup } from '../../../../prisma/generated/client'
import { createMuscleGroupSchema } from './muscle-group.entity'

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

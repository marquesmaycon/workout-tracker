import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

import type { Workout } from '../../../../prisma/generated/client'

export const workoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(3),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Workout>

export const createWorkoutSchema = workoutSchema
  .pick({ name: true, description: true, isActive: true })
  .extend({
    description: z.string().optional(),
  })
  .partial({ isActive: true })

export const updateWorkoutSchema = createWorkoutSchema.extend({
  id: z.string(),
})

export type WorkoutFormSchema = z.infer<typeof createWorkoutSchema>

export const workoutFormDefaultValues: WorkoutFormSchema = {
  name: '',
  description: '',
  isActive: true,
}

export const workoutFormOptions = (workout?: Workout) => {
  return formOptions({
    defaultValues: workout
      ? {
          name: workout.name,
          description: workout.description ?? '',
          isActive: workout.isActive,
        }
      : workoutFormDefaultValues,
    validators: { onSubmit: createWorkoutSchema },
  })
}

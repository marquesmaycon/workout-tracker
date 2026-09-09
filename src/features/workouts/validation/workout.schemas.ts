import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

import type { Workout } from '../../../../prisma/generated/client'
import {
  workoutExerciseFormSchema,
  workoutExerciseSchema,
} from './workout-exercise.schemas'

export const workoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(3),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  exercises: z.array(workoutExerciseSchema),
}) satisfies z.ZodType<Workout>

export const createWorkoutSchema = workoutSchema
  .pick({ name: true, description: true, isActive: true })
  .extend({
    description: z.string().optional(),
    exercises: z
      .array(workoutExerciseFormSchema)
      .min(1, 'Adicione pelo menos um exercício.'),
  })
  .partial({ isActive: true })

export const updateWorkoutSchema = createWorkoutSchema.extend({
  id: z.string(),
})

export type WorkoutFormSchema = z.infer<typeof createWorkoutSchema>
export type WorkoutSchema = z.infer<typeof workoutSchema>

export const workoutFormDefaultValues: WorkoutFormSchema = {
  name: '',
  description: '',
  isActive: true,
  exercises: [],
}

export const workoutFormOptions = (workout?: WorkoutSchema) => {
  return formOptions({
    defaultValues: workout
      ? {
          name: workout.name,
          description: workout.description ?? '',
          isActive: workout.isActive,
          exercises: [...workout.exercises]
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((item) => ({
              exerciseId: item.exerciseId,
              targetSetsMin: item.targetSetsMin?.toString() ?? '',
              targetSetsMax: item.targetSetsMax?.toString() ?? '',
              targetRepsMin: item.targetRepsMin?.toString() ?? '',
              targetRepsMax: item.targetRepsMax?.toString() ?? '',
              targetWeight: item.targetWeight ?? '',
              restSeconds: item.restSeconds?.toString() ?? '',
              notes: item.notes ?? '',
            })),
        }
      : workoutFormDefaultValues,
    validators: { onSubmit: createWorkoutSchema },
  })
}

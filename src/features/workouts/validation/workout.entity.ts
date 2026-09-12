import { z } from 'zod'

import type { Workout } from '../../../../prisma/generated/client'
import { workoutExerciseSchema } from './workout-exercise.entity'
import { workoutExerciseFormSchema } from './workout-exercise.form'

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

export type WorkoutSchema = z.infer<typeof workoutSchema>

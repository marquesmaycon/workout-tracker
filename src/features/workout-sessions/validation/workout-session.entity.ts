import { z } from 'zod'

import { workoutSessionExerciseSchema } from './workout-session-exercise.entity'

export const workoutSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workoutId: z.string(),
  scheduleItemId: z.string().nullable(),
  gymId: z.string().nullable(),
  startedAt: z.date(),
  finishedAt: z.date().nullable(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workout: z.object({
    id: z.string(),
    name: z.string(),
  }),
  gym: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  exercises: z.array(workoutSessionExerciseSchema),
})

export type WorkoutSession = z.infer<typeof workoutSessionSchema>

export const todayWorkoutSchema = z.object({
  scheduleItemId: z.string(),
  workout: z.object({
    id: z.string(),
    name: z.string(),
  }),
})

export const startWorkoutSessionSchema = z.object({
  workoutId: z.string().min(1),
  scheduleItemId: z.string().min(1).optional(),
})

import { z } from 'zod'

export const workoutExerciseSchema = z.object({
  id: z.string(),
  workoutId: z.string(),
  exerciseId: z.string(),
  orderIndex: z.number(),
  targetSetsMin: z.number().nullable(),
  targetSetsMax: z.number().nullable(),
  targetRepsMin: z.number().nullable(),
  targetRepsMax: z.number().nullable(),
  targetWeight: z.string().nullable(),
  restSeconds: z.number().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  exercise: z.object({
    id: z.string(),
    name: z.string(),
  }),
})

export type WorkoutExerciseSchema = z.infer<typeof workoutExerciseSchema>

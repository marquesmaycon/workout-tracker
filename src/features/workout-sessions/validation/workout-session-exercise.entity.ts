import { z } from 'zod'

export const workoutSessionExerciseSchema = z.object({
  id: z.string(),
  workoutSessionId: z.string(),
  exerciseId: z.string(),
  workoutExerciseId: z.string().nullable(),
  gymId: z.string().nullable(),
  orderIndex: z.number(),
  plannedSetsMin: z.number().nullable(),
  plannedSetsMax: z.number().nullable(),
  plannedRepsMin: z.number().nullable(),
  plannedRepsMax: z.number().nullable(),
  plannedWeight: z.string().nullable(),
  actualSets: z.number().nullable(),
  actualReps: z.number().nullable(),
  actualWeight: z.string().nullable(),
  rpe: z.string().nullable(),
  completed: z.boolean(),
  completedAt: z.date().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  exercise: z.object({
    id: z.string(),
    name: z.string(),
  }),
  lastPerformed: z
    .object({
      actualSets: z.number().nullable(),
      actualReps: z.number().nullable(),
      actualWeight: z.string().nullable(),
      rpe: z.string().nullable(),
      completedAt: z.date().nullable(),
    })
    .nullable(),
})

export type WorkoutSessionExercise = z.infer<typeof workoutSessionExerciseSchema>

import { z } from 'zod'

const namedEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const exerciseLogEntrySchema = z.object({
  id: z.string(),
  workoutSessionId: z.string(),
  date: z.date(),
  actualSets: z.number().nullable(),
  actualReps: z.number().nullable(),
  actualWeight: z.string().nullable(),
  rpe: z.string().nullable(),
  notes: z.string().nullable(),
  exercise: namedEntitySchema,
  workout: namedEntitySchema,
  gym: namedEntitySchema.nullable(),
})

export type ExerciseLogEntry = z.infer<typeof exerciseLogEntrySchema>

export const exerciseLogPageSchema = z.object({
  items: z.array(exerciseLogEntrySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  pageCount: z.number(),
})

export type ExerciseLogPage = z.infer<typeof exerciseLogPageSchema>

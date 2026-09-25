import { z } from 'zod'

export const exerciseLogPageSizes = [10, 20, 50] as const

export const exerciseLogSortSchema = z.enum(['date', 'actualWeight', 'actualReps', 'actualSets'])

export type ExerciseLogSort = z.infer<typeof exerciseLogSortSchema>

export const exerciseLogSearchSchema = z.object({
  page: z.number().int().min(1).default(1).catch(1),
  pageSize: z
    .union(exerciseLogPageSizes.map((size) => z.literal(size)))
    .default(20)
    .catch(20),
  sort: exerciseLogSortSchema.default('date').catch('date'),
  order: z.enum(['asc', 'desc']).default('desc').catch('desc'),
  exerciseId: z.string().min(1).optional().catch(undefined),
  workoutId: z.string().min(1).optional().catch(undefined),
  gymId: z.string().min(1).optional().catch(undefined),
  workoutSessionId: z.string().min(1).optional().catch(undefined),
  from: z.iso.date().optional().catch(undefined),
  to: z.iso.date().optional().catch(undefined),
})

export type ExerciseLogSearch = z.infer<typeof exerciseLogSearchSchema>

export type ExerciseLogFilterKey = keyof Pick<ExerciseLogSearch, 'exerciseId' | 'workoutId' | 'gymId' | 'from' | 'to' | 'workoutSessionId'>

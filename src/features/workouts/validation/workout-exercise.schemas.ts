import { z } from 'zod'

import { optionalDecimalString, optionalIntString } from '@/lib/zod-helpers'

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

export const workoutExerciseFormSchema = z
  .object({
    exerciseId: z.string().min(1, 'Selecione um exercício.'),
    targetSetsMin: optionalIntString,
    targetSetsMax: optionalIntString,
    targetRepsMin: optionalIntString,
    targetRepsMax: optionalIntString,
    targetWeight: optionalDecimalString,
    restSeconds: optionalIntString,
    notes: z.string().optional(),
  })
  .refine(
    (item) =>
      !item.targetSetsMin ||
      !item.targetSetsMax ||
      Number(item.targetSetsMax) >= Number(item.targetSetsMin),
    {
      message: 'O máximo de séries deve ser maior ou igual ao mínimo.',
      path: ['targetSetsMax'],
    },
  )
  .refine(
    (item) =>
      !item.targetRepsMin ||
      !item.targetRepsMax ||
      Number(item.targetRepsMax) >= Number(item.targetRepsMin),
    {
      message: 'O máximo de repetições deve ser maior ou igual ao mínimo.',
      path: ['targetRepsMax'],
    },
  )

export type WorkoutExerciseSchema = z.infer<typeof workoutExerciseSchema>
export type WorkoutExerciseFormSchema = z.infer<
  typeof workoutExerciseFormSchema
>

export const workoutExerciseDefaultValues: WorkoutExerciseFormSchema = {
  exerciseId: '',
  targetSetsMin: '',
  targetSetsMax: '',
  targetRepsMin: '',
  targetRepsMax: '',
  targetWeight: '',
  restSeconds: '',
  notes: '',
}

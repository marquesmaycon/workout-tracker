import { z } from 'zod'

import { optionalDecimalString, optionalIntString } from '@/lib/zod-helpers'

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

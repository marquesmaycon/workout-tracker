import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

import { optionalDecimalString, optionalIntString } from '@/lib/zod-helpers'

import type { WorkoutSessionExercise } from './workout-session-exercise.entity'

export const updateSessionExerciseSchema = z.object({
  id: z.string().min(1),
  actualSets: optionalIntString,
  actualReps: optionalIntString,
  actualWeight: optionalDecimalString,
  rpe: optionalDecimalString,
  notes: z.string().optional(),
  completed: z.boolean(),
})

export type SessionExerciseFormSchema = z.infer<typeof updateSessionExerciseSchema>

export const sessionExerciseFormOptions = (exercise: WorkoutSessionExercise) => {
  const defaultValues: SessionExerciseFormSchema = {
    id: exercise.id,
    actualSets: exercise.actualSets?.toString() ?? '',
    actualReps: exercise.actualReps?.toString() ?? '',
    actualWeight: exercise.actualWeight ?? '',
    rpe: exercise.rpe ?? '',
    notes: exercise.notes ?? '',
    completed: exercise.completed,
  }

  return formOptions({
    defaultValues,
    validators: { onSubmit: updateSessionExerciseSchema },
  })
}

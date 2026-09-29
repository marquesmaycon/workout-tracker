import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

import type { WorkoutSessionExercise } from './workout-session-exercise.entity'

const REQUIRED_TO_COMPLETE_MESSAGE = 'Informe para completar o exercício'

// Campos que podem ficar em branco durante o treino, mas são exigidos para concluir o exercício.
export const requiredToCompleteSchema = z.string().trim().min(1, REQUIRED_TO_COMPLETE_MESSAGE)

const requiredToCompleteFields = ['actualSets', 'actualReps', 'actualWeight', 'rpe'] as const

export const updateSessionExerciseSchema = z
  .object({
    id: z.string().min(1),
    actualSets: z.string(),
    actualReps: z.string(),
    actualWeight: z.string(),
    rpe: z.string(),
    notes: z.string().optional(),
    completed: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (!value.completed) return

    for (const field of requiredToCompleteFields) {
      if (!value[field].trim()) {
        ctx.addIssue({ code: 'custom', path: [field], message: REQUIRED_TO_COMPLETE_MESSAGE })
      }
    }
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

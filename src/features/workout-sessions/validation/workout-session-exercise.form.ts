import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

import type { WorkoutSessionExercise } from './workout-session-exercise.entity'

export const updateSessionExerciseSchema = z.object({
  id: z.string().min(1),
  actualSets: z.string().min(1, 'Informe para completar o exercício'),
  actualReps: z.string().min(1, 'Informe para completar o exercício'),
  actualWeight: z.string().min(1, 'Informe para completar o exercício'),
  rpe: z.string().min(1, 'Informe para completar o exercício'),
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

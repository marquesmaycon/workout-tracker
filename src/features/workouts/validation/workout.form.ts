import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

import { createWorkoutSchema, type WorkoutSchema } from './workout.entity'

export type WorkoutFormSchema = z.infer<typeof createWorkoutSchema>

export const workoutFormDefaultValues: WorkoutFormSchema = {
  name: '',
  description: '',
  isActive: true,
  exercises: [],
}

export const workoutFormOptions = (workout?: WorkoutSchema) => {
  return formOptions({
    defaultValues: workout
      ? {
          name: workout.name,
          description: workout.description ?? '',
          isActive: workout.isActive,
          exercises: [...workout.exercises]
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((item) => ({
              exerciseId: item.exerciseId,
              targetSetsMin: item.targetSetsMin?.toString() ?? '',
              targetSetsMax: item.targetSetsMax?.toString() ?? '',
              targetRepsMin: item.targetRepsMin?.toString() ?? '',
              targetRepsMax: item.targetRepsMax?.toString() ?? '',
              targetWeight: item.targetWeight ?? '',
              restSeconds: item.restSeconds?.toString() ?? '',
              notes: item.notes ?? '',
            })),
        }
      : workoutFormDefaultValues,
    validators: { onSubmit: createWorkoutSchema },
  })
}

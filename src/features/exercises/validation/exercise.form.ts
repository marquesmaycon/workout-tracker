import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

import {
  createExerciseSchema,
  type ExerciseWithMuscleGroups,
} from './exercise.entity'

export type ExerciseFormSchema = z.infer<typeof createExerciseSchema>

export const exerciseFormDefaultValues: ExerciseFormSchema = {
  name: '',
  description: '',
  instructions: '',
  videoUrl: '',
  muscleGroupIds: [],
  primaryMuscleGroupId: '',
}

export const exerciseFormOptions = (exercise?: ExerciseWithMuscleGroups) => {
  return formOptions({
    defaultValues: exercise
      ? {
          name: exercise.name,
          description: exercise.description ?? '',
          instructions: exercise.instructions ?? '',
          videoUrl: exercise.videoUrl ?? '',
          muscleGroupIds: exercise.muscleGroups.map(
            ({ muscleGroupId }) => muscleGroupId,
          ),
          primaryMuscleGroupId:
            exercise.muscleGroups.find(({ isPrimary }) => isPrimary)
              ?.muscleGroupId ?? '',
        }
      : exerciseFormDefaultValues,
    validators: { onSubmit: createExerciseSchema },
  })
}

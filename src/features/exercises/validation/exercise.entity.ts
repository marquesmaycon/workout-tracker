import { z } from 'zod'

import { muscleGroupSchema } from '@/features/muscle-groups/validation/muscle-group.entity'

import type { Exercise } from '../../../../prisma/generated/client'

export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().nullable(),
  instructions: z.string().nullable(),
  videoUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Exercise>

export const exerciseMuscleGroupSchema = z.object({
  muscleGroupId: z.string(),
  isPrimary: z.boolean(),
  muscleGroup: muscleGroupSchema,
})

export const exerciseWithMuscleGroupsSchema = exerciseSchema.extend({
  muscleGroups: z.array(exerciseMuscleGroupSchema),
})

export const createExerciseSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  instructions: z.string().optional(),
  videoUrl: z.string().optional(),
  muscleGroupIds: z.array(z.string()).min(1),
  primaryMuscleGroupId: z.string().min(1),
})

export const updateExerciseSchema = createExerciseSchema.extend({
  id: z.string(),
})

export type ExerciseWithMuscleGroups = z.infer<
  typeof exerciseWithMuscleGroupsSchema
>

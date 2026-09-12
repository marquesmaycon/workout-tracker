import { z } from 'zod'
import type { MuscleGroup } from '../../../../prisma/generated/client'

export const muscleGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<MuscleGroup>

export const createMuscleGroupSchema = muscleGroupSchema.pick({ name: true })

export const updateMuscleGroupSchema = muscleGroupSchema
  .pick({ id: true })
  .extend(createMuscleGroupSchema.shape)

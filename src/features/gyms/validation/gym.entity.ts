import { z } from 'zod'
import type { Gym } from '../../../../prisma/generated/client'

export const gymSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  favorite: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Gym>

export const createGymSchema = gymSchema
  .pick({ name: true, favorite: true })
  .partial({ favorite: true })

export const updateGymSchema = gymSchema
  .pick({ id: true })
  .extend(createGymSchema.shape)

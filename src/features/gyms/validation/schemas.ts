import { z } from 'zod'

export const gymSchema = z.object({
  id: z.string(),
  name: z.string(),
  favorite: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createGymSchema = gymSchema
  .pick({ name: true, favorite: true })
  .partial({ favorite: true })

export const updateGymSchema = gymSchema
  .pick({ id: true })
  .extend(createGymSchema.shape)

import { z } from 'zod'

export const TodoSchema = z.object({
  id: z.number().int().min(1),
  name: z.string(),
})

export const GymSchema = z.object({
  id: z.string(),
  name: z.string(),
  favorite: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateGymSchema = GymSchema.pick({
  name: true,
  favorite: true,
}).partial({
  favorite: true,
})

export const UpdateGymSchema = GymSchema.pick({ id: true })
  .merge(CreateGymSchema.partial())
  .refine((data) => data.name !== undefined || data.favorite !== undefined)

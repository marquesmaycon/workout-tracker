import { z } from 'zod'
import { formOptions } from '@tanstack/react-form'
import type { Gym } from '../../../../prisma/generated/client'
import { createGymSchema } from './gym.entity'

export type GymFormSchema = z.infer<typeof createGymSchema>

export const gymFormDefaultValues: GymFormSchema = {
  name: '',
  favorite: false,
}

export const gymFormOptions = (gym?: Gym) => {
  return formOptions({
    defaultValues: gym ?? gymFormDefaultValues,
    validators: { onSubmit: createGymSchema },
  })
}

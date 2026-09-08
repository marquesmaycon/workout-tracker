import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

import type {
  Schedule,
  ScheduleItem,
} from '../../../../prisma/generated/client'

export const weekdayOptions = [
  { value: 1, label: 'Segunda', short: 'Seg' },
  { value: 2, label: 'Terça', short: 'Ter' },
  { value: 3, label: 'Quarta', short: 'Qua' },
  { value: 4, label: 'Quinta', short: 'Qui' },
  { value: 5, label: 'Sexta', short: 'Sex' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
  { value: 7, label: 'Domingo', short: 'Dom' },
]

const scheduleItemSchema = z.object({
  id: z.string(),
  scheduleId: z.string(),
  workoutId: z.string(),
  weekday: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workout: z.object({
    id: z.string(),
    name: z.string(),
    isActive: z.boolean(),
  }),
  _count: z.object({ workoutSessions: z.number() }),
}) satisfies z.ZodType<ScheduleItem>

export const scheduleSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(scheduleItemSchema),
}) satisfies z.ZodType<Schedule>

export const createScheduleSchema = z.object({
  name: z.string().trim().min(3, 'Informe pelo menos três caracteres.'),
  description: z.string(),
  isActive: z.boolean(),
  items: z
    .array(
      z.object({
        id: z.string().min(1).optional(),
        weekday: z.number().int().min(1).max(7),
        workoutId: z.string().min(1, 'Selecione um treino.'),
      }),
    )
    .min(1, 'Selecione pelo menos um dia de treino.')
    .refine((items) => {
      const weekdays = items.map((item) => item.weekday)
      return new Set(weekdays).size === weekdays.length
    }, 'Não repita dias da semana.'),
})

export const updateScheduleSchema = createScheduleSchema.extend({
  id: z.string().min(1),
})

type ScheduleFormSchema = z.input<typeof createScheduleSchema>
export type ScheduleSchema = z.infer<typeof scheduleSchema>

const scheduleFormDefaultValues: ScheduleFormSchema = {
  name: '',
  description: '',
  isActive: true,
  items: [],
}

export const scheduleFormOptions = (schedule?: ScheduleSchema) => {
  const defaultValues: ScheduleFormSchema = schedule
    ? {
        ...schedule,
        description: schedule.description ?? '',
        items: [...schedule.items]
          .sort((a, b) => a.weekday - b.weekday)
          .map(({ id, weekday, workoutId }) => ({ id, weekday, workoutId })),
      }
    : scheduleFormDefaultValues

  return formOptions({
    defaultValues,
    validators: { onSubmit: createScheduleSchema },
  })
}

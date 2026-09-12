import { formOptions } from '@tanstack/react-form'
import type { z } from 'zod'

import {
  createScheduleSchema,
  type ScheduleSchema,
} from './schedule.entity'

export const weekdayOptions = [
  { value: 1, label: 'Segunda', short: 'Seg' },
  { value: 2, label: 'Terça', short: 'Ter' },
  { value: 3, label: 'Quarta', short: 'Qua' },
  { value: 4, label: 'Quinta', short: 'Qui' },
  { value: 5, label: 'Sexta', short: 'Sex' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
  { value: 7, label: 'Domingo', short: 'Dom' },
]

type ScheduleFormSchema = z.input<typeof createScheduleSchema>

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

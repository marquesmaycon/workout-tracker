import { Link, useRouter } from '@tanstack/react-router'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppForm } from '@/hooks/form'

import { useScheduleMutations } from '../hooks/use-schedule-mutations'
import type { ScheduleSchema } from '../validation/schemas'
import { scheduleFormOptions, weekdayOptions } from '../validation/schemas'

type WorkoutOption = { id: string; name: string; isActive: boolean }

export function ScheduleForm({
  schedule,
  workouts,
}: {
  schedule?: ScheduleSchema
  workouts: WorkoutOption[]
}) {
  const router = useRouter()

  const { createSchedule, updateSchedule } = useScheduleMutations()

  const form = useAppForm({
    ...scheduleFormOptions(schedule),
    onSubmit: async ({ value }) => {
      if (schedule) {
        await updateSchedule({ id: schedule.id, ...value })
        toast.success('Programação atualizada com sucesso!')
      } else {
        const newSchedule = await createSchedule(value)
        toast.success('Programação criada com sucesso!')
        await router.navigate({
          to: '/schedules/$scheduleId',
          params: { scheduleId: newSchedule.id },
        })
      }
    },
  })
  const workoutsById = useMemo(
    () => new Map(workouts.map((workout) => [workout.id, workout])),
    [workouts],
  )
  const originalItemsById = useMemo(
    () => new Map(schedule?.items.map((item) => [item.id, item])),
    [schedule],
  )
  const activeWorkouts = useMemo(
    () => workouts.filter((workout) => workout.isActive),
    [workouts],
  )
  const workoutOptions = useMemo(
    () =>
      activeWorkouts.map((workout) => ({
        value: workout.id,
        label: workout.name,
      })),
    [activeWorkouts],
  )

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
        >
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <fieldset disabled={isSubmitting} className="min-w-0">
                <FieldGroup>
                  <form.AppField name="name">
                    {({ InputField }) => <InputField label="Nome" />}
                  </form.AppField>
                  <form.AppField name="description">
                    {({ TextareaField }) => (
                      <TextareaField label="Descrição" rows={3} />
                    )}
                  </form.AppField>
                  <form.AppField name="items">
                    {(field) => {
                      const items = field.state.value
                      const itemsByWeekday = new Map(
                        items.map((item) => [item.weekday, item]),
                      )
                      const isLocked = (itemId: string | undefined) =>
                        !!itemId &&
                        (originalItemsById.get(itemId)?._count
                          .workoutSessions ?? 0) > 0

                      const toggleWeekday = (
                        weekday: number,
                        checked: boolean,
                      ) => {
                        field.handleChange(
                          checked
                            ? [...items, { weekday, workoutId: '' }].sort(
                                (a, b) => a.weekday - b.weekday,
                              )
                            : items.filter((item) => item.weekday !== weekday),
                        )
                      }

                      const setWorkout = (weekday: number, workoutId: string) =>
                        field.handleChange(
                          items.map((item) =>
                            item.weekday === weekday
                              ? { ...item, workoutId }
                              : item,
                          ),
                        )

                      return (
                        <Field data-invalid={!field.state.meta.isValid}>
                          <FieldSet>
                            <FieldLegend variant="label">
                              Dias de treino
                            </FieldLegend>
                            <FieldDescription>
                              Selecione os dias da semana e escolha um treino
                              para cada um.
                            </FieldDescription>
                            <FieldGroup
                              data-slot="checkbox-group"
                              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                            >
                              {weekdayOptions.map((day) => {
                                const item = itemsByWeekday.get(day.value)
                                const locked = isLocked(item?.id)
                                const id = `schedule-weekday-${day.value}`
                                return (
                                  <Field
                                    key={day.value}
                                    orientation="horizontal"
                                  >
                                    <Checkbox
                                      id={id}
                                      checked={!!item}
                                      disabled={locked}
                                      onCheckedChange={(checked) =>
                                        toggleWeekday(
                                          day.value,
                                          Boolean(checked),
                                        )
                                      }
                                    />
                                    <FieldLabel
                                      htmlFor={id}
                                      className="font-normal"
                                    >
                                      {day.label}
                                    </FieldLabel>
                                  </Field>
                                )
                              })}
                            </FieldGroup>
                          </FieldSet>

                          <ol className="mt-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap">
                            {weekdayOptions
                              .filter((day) => itemsByWeekday.has(day.value))
                              .map((day) => {
                                const item = itemsByWeekday.get(day.value)
                                if (!item) return null

                                const original = item.id
                                  ? originalItemsById.get(item.id)
                                  : undefined

                                const workout =
                                  workoutsById.get(item.workoutId) ??
                                  original?.workout

                                const locked = isLocked(item.id)

                                const options =
                                  workout && !workout.isActive
                                    ? [
                                        ...workoutOptions,
                                        {
                                          value: workout.id,
                                          label: `${workout.name} (inativo)`,
                                        },
                                      ]
                                    : workoutOptions

                                return (
                                  <li
                                    key={day.value}
                                    className="grid flex-1 gap-2 rounded-lg border p-3 lg:min-w-52"
                                  >
                                    <label
                                      htmlFor={`schedule-item-${day.value}`}
                                      className="text-sm font-medium"
                                    >
                                      {day.label}
                                    </label>
                                    <Select
                                      items={options}
                                      value={item.workoutId}
                                      disabled={locked}
                                      onValueChange={(value) => {
                                        if (value)
                                          setWorkout(day.value, String(value))
                                      }}
                                    >
                                      <SelectTrigger
                                        id={`schedule-item-${day.value}`}
                                        className="w-full"
                                      >
                                        <SelectValue placeholder="Selecione um treino" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {options.map((option) => (
                                          <SelectItem
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    {workout && !workout.isActive && (
                                      <p className="text-destructive text-sm">
                                        Treino inativo. Substitua-o ou reative o
                                        treino para ativar a programação.
                                      </p>
                                    )}
                                    {locked && (
                                      <p className="text-muted-foreground text-xs">
                                        Dia com histórico: não pode ser removido
                                        nem ter o treino alterado.
                                      </p>
                                    )}
                                  </li>
                                )
                              })}
                          </ol>
                          {!activeWorkouts.length && (
                            <p className="text-muted-foreground text-sm">
                              Nenhum treino ativo disponível.{' '}
                              <Link to="/workouts/create" className="underline">
                                Cadastre um treino
                              </Link>{' '}
                              ou reative um existente.
                            </p>
                          )}
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )
                    }}
                  </form.AppField>

                  <form.AppField name="isActive">
                    {({ CheckboxField }) => (
                      <CheckboxField
                        label="Programação ativa"
                        description="Ao ativar, a programação anterior será desativada. Apenas uma pode ficar ativa."
                      />
                    )}
                  </form.AppField>
                  <form.AppForm>
                    <form.SubmitButton
                      label={
                        schedule ? 'Salvar programação' : 'Criar programação'
                      }
                    />
                  </form.AppForm>
                </FieldGroup>
              </fieldset>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  )
}

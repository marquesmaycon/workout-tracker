import { Link, useRouter } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
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
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null)

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
  const activeWorkouts = workouts.filter((workout) => workout.isActive)
  const workoutOptions = activeWorkouts.map((workout) => ({
    value: workout.id,
    label: workout.name,
  }))

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
                  <form.AppField name="weekdays">
                    {(field) => (
                      <Field data-invalid={!field.state.meta.isValid}>
                        <FieldLabel>Dias de treino</FieldLabel>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {weekdayOptions.map((day) => (
                            <label
                              key={day.value}
                              className="flex items-center gap-2 rounded-md border p-3 text-sm"
                            >
                              <Checkbox
                                checked={field.state.value.includes(day.value)}
                                onCheckedChange={(checked) => {
                                  field.handleChange(
                                    checked
                                      ? [...field.state.value, day.value].sort(
                                          (a, b) => a - b,
                                        )
                                      : field.state.value.filter(
                                          (value) => value !== day.value,
                                        ),
                                  )
                                }}
                              />
                              {day.label}
                            </label>
                          ))}
                        </div>
                        <FieldDescription>
                          Os dias indicam quando treinar. A sequência continua
                          de onde você parou, sem reiniciar na semana seguinte.
                        </FieldDescription>
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    )}
                  </form.AppField>
                  <form.AppField name="items">
                    {(field) => (
                      <Field data-invalid={!field.state.meta.isValid}>
                        <FieldLabel>Sequência de treinos</FieldLabel>
                        <FieldDescription>
                          Adicione os treinos na ordem desejada. Você pode
                          repetir um treino; após o último, a sequência volta ao
                          primeiro.
                        </FieldDescription>
                        <ol className="grid gap-3">
                          {field.state.value.map((item, index) => {
                            const original = schedule?.items.find(
                              (entry) => entry.id === item.id,
                            )
                            const workout =
                              workouts.find(
                                (entry) => entry.id === item.workoutId,
                              ) ?? original?.workout
                            const locked =
                              (original?._count.workoutSessions ?? 0) > 0
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
                            const move = (target: number) => {
                              const next = [...field.state.value]
                              const [moved] = next.splice(index, 1)
                              next.splice(target, 0, moved)
                              field.handleChange(next)
                            }
                            return (
                              <li
                                key={item.id ?? `new-${index}`}
                                className="grid min-w-0 gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_auto] sm:items-center"
                              >
                                <div className="grid min-w-0 gap-2">
                                  <label
                                    htmlFor={`schedule-item-${index}`}
                                    className="text-sm font-medium"
                                  >
                                    Etapa {index + 1}
                                  </label>
                                  <Select
                                    items={options}
                                    value={item.workoutId}
                                    disabled={locked}
                                    onValueChange={(value) => {
                                      if (value)
                                        field.handleChange(
                                          field.state.value.map(
                                            (entry, position) =>
                                              position === index
                                                ? {
                                                    ...entry,
                                                    workoutId: String(value),
                                                  }
                                                : entry,
                                          ),
                                        )
                                    }}
                                  >
                                    <SelectTrigger
                                      id={`schedule-item-${index}`}
                                      className="w-full"
                                    >
                                      <SelectValue />
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
                                      Etapa com histórico: permite apenas
                                      reordenação.
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === 0}
                                    onClick={() => move(index - 1)}
                                    aria-label={`Subir etapa ${index + 1}`}
                                  >
                                    <ArrowUp aria-hidden="true" />
                                    Subir
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                      index === field.state.value.length - 1
                                    }
                                    onClick={() => move(index + 1)}
                                    aria-label={`Descer etapa ${index + 1}`}
                                  >
                                    <ArrowDown aria-hidden="true" />
                                    Descer
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={locked}
                                    onClick={() =>
                                      field.handleChange(
                                        field.state.value.filter(
                                          (_, position) => position !== index,
                                        ),
                                      )
                                    }
                                    aria-label={`Remover etapa ${index + 1}`}
                                  >
                                    <Trash2 aria-hidden="true" />
                                    Remover
                                  </Button>
                                </div>
                              </li>
                            )
                          })}
                        </ol>
                        {activeWorkouts.length ? (
                          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                            <Select
                              items={workoutOptions}
                              value={selectedWorkout}
                              onValueChange={(value) =>
                                setSelectedWorkout(value ? String(value) : null)
                              }
                            >
                              <SelectTrigger
                                aria-label="Treino para adicionar"
                                className="w-full"
                              >
                                <SelectValue placeholder="Selecione um treino" />
                              </SelectTrigger>
                              <SelectContent>
                                {workoutOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="outline"
                              disabled={!selectedWorkout}
                              onClick={() => {
                                if (selectedWorkout)
                                  field.handleChange([
                                    ...field.state.value,
                                    { workoutId: selectedWorkout },
                                  ])
                              }}
                            >
                              <Plus aria-hidden="true" />
                              Adicionar treino
                            </Button>
                          </div>
                        ) : (
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
                    )}
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

import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { withForm } from '@/hooks/form'
import { decimalOnly, digitsOnly } from '@/lib/input-masks'
import { orpc } from '@/orpc/client'

import { workoutFormOptions } from '../validation/workout.form'
import { workoutExerciseDefaultValues } from '../validation/workout-exercise.form'

const exercisesQuery = orpc.exercises.list.queryOptions()

export const WorkoutExerciseChildForm = withForm({
  ...workoutFormOptions(),
  render: function Render({ form }) {
    const { data: exercises } = useSuspenseQuery(exercisesQuery)
    const exerciseOptions = exercises.map((exercise) => ({
      value: exercise.id,
      label: exercise.name,
    }))

    return (
      <form.AppField name="exercises" mode="array">
        {(field) => {
          const items = field.state.value

          const addExercise = () =>
            field.pushValue(workoutExerciseDefaultValues)

          const removeExercise = (index: number) => field.removeValue(index)

          const moveExercise = (index: number, offset: 1 | -1) => {
            const target = index + offset
            if (target < 0 || target >= items.length) return
            field.moveValue(index, target)
          }

          return (
            <Field data-invalid={!field.state.meta.isValid}>
              <FieldSet>
                <FieldLegend variant="label">Exercícios</FieldLegend>
                <FieldDescription>
                  Adicione os exercícios deste treino e defina séries,
                  repetições, peso e descanso.
                </FieldDescription>

                <ol className="flex flex-col gap-3">
                  {items.map((_, index) => (
                    <li
                      key={index}
                      className="grid gap-3 rounded-lg border p-3"
                    >
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <form.AppField
                            name={`exercises[${index}].exerciseId`}
                          >
                            {({ SelectField }) => (
                              <SelectField
                                label="Exercício"
                                options={exerciseOptions}
                                placeholder="Selecione um exercício"
                              />
                            )}
                          </form.AppField>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => moveExercise(index, -1)}
                          disabled={index === 0}
                          aria-label="Mover para cima"
                        >
                          <ArrowUp aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => moveExercise(index, 1)}
                          disabled={index === items.length - 1}
                          aria-label="Mover para baixo"
                        >
                          <ArrowDown aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeExercise(index)}
                          aria-label="Remover exercício"
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
                        <form.AppField
                          name={`exercises[${index}].targetSetsMin`}
                        >
                          {({ InputField }) => (
                            <InputField
                              label="Séries (min)"
                              inputMode="numeric"
                              mask={digitsOnly}
                            />
                          )}
                        </form.AppField>
                        <form.AppField
                          name={`exercises[${index}].targetSetsMax`}
                        >
                          {({ InputField }) => (
                            <InputField
                              label="Séries (max)"
                              inputMode="numeric"
                              mask={digitsOnly}
                            />
                          )}
                        </form.AppField>
                        <form.AppField
                          name={`exercises[${index}].targetRepsMin`}
                        >
                          {({ InputField }) => (
                            <InputField
                              label="Reps (min)"
                              inputMode="numeric"
                              mask={digitsOnly}
                            />
                          )}
                        </form.AppField>
                        <form.AppField
                          name={`exercises[${index}].targetRepsMax`}
                        >
                          {({ InputField }) => (
                            <InputField
                              label="Reps (max)"
                              inputMode="numeric"
                              mask={digitsOnly}
                            />
                          )}
                        </form.AppField>
                        <form.AppField
                          name={`exercises[${index}].targetWeight`}
                        >
                          {({ InputField }) => (
                            <InputField
                              label="Peso alvo"
                              inputMode="decimal"
                              mask={decimalOnly}
                            />
                          )}
                        </form.AppField>
                        <form.AppField name={`exercises[${index}].restSeconds`}>
                          {({ InputField }) => (
                            <InputField
                              label="Descanso (s)"
                              inputMode="numeric"
                              mask={digitsOnly}
                            />
                          )}
                        </form.AppField>
                        <div className="col-span-2">
                          <form.AppField name={`exercises[${index}].notes`}>
                            {({ TextareaField }) => (
                              <TextareaField label="Notas" />
                            )}
                          </form.AppField>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                {exercises.length > 0 ? (
                  <Button type="button" variant="outline" onClick={addExercise}>
                    <Plus aria-hidden="true" />
                    Adicionar exercício
                  </Button>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Nenhum exercício cadastrado.{' '}
                    <Link to="/exercises/create" className="underline">
                      Cadastre um exercício
                    </Link>{' '}
                    para adicioná-lo ao treino.
                  </p>
                )}
              </FieldSet>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )
        }}
      </form.AppField>
    )
  },
})

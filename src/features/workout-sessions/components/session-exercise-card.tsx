import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { decimalOnly, digitsOnly } from '@/lib/input-masks'

import { useWorkoutSessionMutations } from '../hooks/use-workout-session-mutations'
import type { WorkoutSessionExercise } from '../validation/workout-session-exercise.schemas'
import { sessionExerciseFormOptions } from '../validation/workout-session-exercise.schemas'

type SessionExerciseCardProps = {
  exercise: WorkoutSessionExercise
  readOnly: boolean
  onSaved: () => void
}

export function SessionExerciseCard({
  exercise,
  readOnly,
  onSaved,
}: SessionExerciseCardProps) {
  const { updateSessionExercise } = useWorkoutSessionMutations()

  const form = useAppForm({
    ...sessionExerciseFormOptions(exercise),
    onSubmit: async ({ value }) => {
      await updateSessionExercise(value)
      toast.success(`${exercise.exercise.name} atualizado`)
      onSaved()
    },
  })

  const target = formatTarget(exercise)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>{exercise.exercise.name}</CardTitle>
        {target && (
          <span className="text-muted-foreground text-xs">Alvo: {target}</span>
        )}
      </CardHeader>
      <CardContent>
        {readOnly ? (
          <p className="text-sm">
            {exercise.actualSets ?? '—'} séries x {exercise.actualReps ?? '—'}{' '}
            reps
            {exercise.actualWeight ? ` · ${exercise.actualWeight} kg` : ''}
            {exercise.rpe ? ` · RPE ${exercise.rpe}` : ''}
          </p>
        ) : (
          <form
            onSubmit={(ev) => {
              ev.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <form.AppField name="actualSets">
                  {({ InputField }) => (
                    <InputField
                      label="Séries"
                      inputMode="numeric"
                      mask={digitsOnly}
                    />
                  )}
                </form.AppField>
                <form.AppField name="actualReps">
                  {({ InputField }) => (
                    <InputField
                      label="Reps"
                      inputMode="numeric"
                      mask={digitsOnly}
                    />
                  )}
                </form.AppField>
                <form.AppField name="actualWeight">
                  {({ InputField }) => (
                    <InputField
                      label="Peso"
                      inputMode="decimal"
                      mask={decimalOnly}
                    />
                  )}
                </form.AppField>
                <form.AppField name="rpe">
                  {({ InputField }) => (
                    <InputField
                      label="RPE"
                      inputMode="decimal"
                      mask={decimalOnly}
                    />
                  )}
                </form.AppField>
              </div>
              <form.AppField name="notes">
                {({ TextareaField }) => (
                  <TextareaField label="Notas" rows={2} />
                )}
              </form.AppField>
              <form.AppField name="completed">
                {({ CheckboxField }) => (
                  <CheckboxField label="Exercício concluído" />
                )}
              </form.AppField>
              <Field>
                <form.AppForm>
                  <form.SubmitButton label="Salvar" />
                </form.AppForm>
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

function formatTarget(exercise: WorkoutSessionExercise) {
  const sets =
    exercise.plannedSetsMin && exercise.plannedSetsMax
      ? `${exercise.plannedSetsMin}-${exercise.plannedSetsMax} séries`
      : null
  const reps =
    exercise.plannedRepsMin && exercise.plannedRepsMax
      ? `${exercise.plannedRepsMin}-${exercise.plannedRepsMax} reps`
      : null
  const weight = exercise.plannedWeight ? `${exercise.plannedWeight} kg` : null
  return [sets, reps, weight].filter(Boolean).join(' x ') || null
}

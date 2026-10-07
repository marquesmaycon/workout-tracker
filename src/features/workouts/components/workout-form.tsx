import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'

import { useWorkoutMutations } from '../hooks/use-workout-mutations'
import type { WorkoutSchema } from '../validation/workout.entity'
import { workoutFormOptions } from '../validation/workout.form'
import { WorkoutExerciseChildForm } from './workout-exercise-child-form'

type WorkoutFormProps = {
  workout?: WorkoutSchema
}

export function WorkoutForm({ workout }: WorkoutFormProps) {
  const router = useRouter()
  const isEditing = Boolean(workout)

  const { createWorkout, updateWorkout } = useWorkoutMutations()

  const form = useAppForm({
    ...workoutFormOptions(workout),
    onSubmit: async ({ value }) => {
      if (isEditing && workout) {
        await updateWorkout({ id: workout.id, ...value })
        toast.success('Treino atualizado')
        return
      }

      await createWorkout(value)
      toast.success('Treino criado')
      router.navigate({ to: '/workouts' })
    },
  })

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={(ev) => {
            ev.preventDefault()
            form.handleSubmit()
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
                      <TextareaField label="Descricao" rows={3} />
                    )}
                  </form.AppField>

                  <WorkoutExerciseChildForm form={form} />

                  <form.AppField name="isActive">
                    {({ CheckboxField }) => (
                      <CheckboxField
                        label="Ativo"
                        description="Deixe marcado para usar este treino nas rotinas."
                      />
                    )}
                  </form.AppField>

                  <Field>
                    <form.AppForm>
                      <form.SubmitButton
                        label={isEditing ? 'Salvar treino' : 'Criar treino'}
                      />
                    </form.AppForm>
                  </Field>
                </FieldGroup>
              </fieldset>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  )
}

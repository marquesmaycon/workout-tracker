import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'

import type { Workout } from '../../../../prisma/generated/client'
import { useWorkoutMutations } from '../hooks/use-workout-mutations'
import { workoutFormOptions } from '../validation/schemas'

type WorkoutFormProps = {
  workout?: Workout
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

      const newWorkout = await createWorkout(value)
      toast.success('Treino criado')
      router.navigate({
        to: '/workouts/$workoutId',
        params: { workoutId: newWorkout.id },
      })
    },
  })

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {isEditing ? 'Editar treino' : 'Novo treino'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(ev) => {
            ev.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              {isEditing ? 'Atualize os dados' : 'Cadastre um treino'}
            </FieldSeparator>

            <form.AppField name="name">
              {({ InputField }) => <InputField label="Nome" />}
            </form.AppField>

            <form.AppField name="description">
              {({ TextareaField }) => (
                <TextareaField label="Descricao" rows={3} />
              )}
            </form.AppField>

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
        </form>
      </CardContent>
    </Card>
  )
}

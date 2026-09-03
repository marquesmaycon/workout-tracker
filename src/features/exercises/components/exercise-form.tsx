import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'

import type { MuscleGroup } from '../../../../prisma/generated/client'
import { useExerciseMutations } from '../hooks/use-exercise-mutations'
import type { ExerciseWithMuscleGroups } from '../validation/schemas'
import { exerciseFormOptions } from '../validation/schemas'

type ExerciseFormProps = {
  exercise?: ExerciseWithMuscleGroups
  muscleGroups: MuscleGroup[]
}

export function ExerciseForm({ exercise, muscleGroups }: ExerciseFormProps) {
  const router = useRouter()
  const isEditing = Boolean(exercise)

  const { createExercise, updateExercise } = useExerciseMutations()

  const form = useAppForm({
    ...exerciseFormOptions(exercise),
    onSubmit: async ({ value }) => {
      if (isEditing && exercise) {
        await updateExercise({ id: exercise.id, ...value })
        toast.success('Exercicio atualizado')
        return
      }

      const newExercise = await createExercise(value)
      toast.success('Exercicio criado')
      router.navigate({
        to: '/exercises/$exerciseId',
        params: { exerciseId: newExercise.id },
      })
    },
  })

  const muscleGroupOptions = muscleGroups.map((muscleGroup) => ({
    label: muscleGroup.name,
    value: muscleGroup.id,
  }))

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {isEditing ? 'Editar exercicio' : 'Novo exercicio'}
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
              {isEditing ? 'Atualize os dados' : 'Cadastre um exercicio'}
            </FieldSeparator>

            <form.AppField name="name">
              {({ InputField }) => <InputField label="Nome" />}
            </form.AppField>

            <form.AppField name="description">
              {({ TextareaField }) => (
                <TextareaField label="Descricao" rows={3} />
              )}
            </form.AppField>

            <form.AppField name="instructions">
              {({ TextareaField }) => (
                <TextareaField label="Instrucoes" rows={4} />
              )}
            </form.AppField>

            <form.AppField name="videoUrl">
              {({ InputField }) => <InputField label="URL do video" />}
            </form.AppField>

            <form.AppField name="muscleGroupIds">
              {(field) => (
                <Field data-invalid={!field.state.meta.isValid}>
                  <FieldLabel>Grupos musculares</FieldLabel>
                  <div className="grid gap-2 rounded-md border p-3">
                    {muscleGroups.length > 0 ? (
                      muscleGroups.map((muscleGroup) => {
                        const checked = field.state.value.includes(
                          muscleGroup.id,
                        )

                        return (
                          <label
                            key={muscleGroup.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) => {
                                const nextValue =
                                  value === true
                                    ? [...field.state.value, muscleGroup.id]
                                    : field.state.value.filter(
                                        (id) => id !== muscleGroup.id,
                                      )

                                field.handleChange(nextValue)

                                const primaryValue =
                                  form.getFieldValue('primaryMuscleGroupId')
                                if (
                                  value !== true &&
                                  primaryValue === muscleGroup.id
                                ) {
                                  form.setFieldValue(
                                    'primaryMuscleGroupId',
                                    nextValue.at(0) ?? '',
                                  )
                                }
                                if (
                                  value === true &&
                                  !primaryValue &&
                                  nextValue.length === 1
                                ) {
                                  form.setFieldValue(
                                    'primaryMuscleGroupId',
                                    muscleGroup.id,
                                  )
                                }
                              }}
                            />
                            <span>{muscleGroup.name}</span>
                          </label>
                        )
                      })
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        Cadastre grupos musculares antes de criar exercicios.
                      </p>
                    )}
                  </div>
                  <FieldDescription>
                    Selecione pelo menos um grupo muscular.
                  </FieldDescription>
                </Field>
              )}
            </form.AppField>

            <form.AppField name="primaryMuscleGroupId">
              {({ SelectField }) => (
                <SelectField
                  label="Grupo muscular principal"
                  placeholder="Selecione"
                  options={muscleGroupOptions}
                />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton
                  label={isEditing ? 'Salvar exercicio' : 'Criar exercicio'}
                />
              </form.AppForm>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

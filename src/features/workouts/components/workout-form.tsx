import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'

import { useWorkoutMutations } from '../hooks/use-workout-mutations'
import type { WorkoutSchema } from '../validation/workout.entity'
import { workoutFormOptions } from '../validation/workout.form'
import { WorkoutExerciseChildForm } from './workout-exercise-child-form'
import type {WorkoutTemplateSelection} from './workout-templates';
import {
  WorkoutTemplates
} from './workout-templates'

type WorkoutFormProps = {
  workout?: WorkoutSchema
}

export function WorkoutForm({ workout }: WorkoutFormProps) {
  const router = useRouter()
  const isEditing = Boolean(workout)

  const { createWorkout, updateWorkout } = useWorkoutMutations()

  const [pendingTemplate, setPendingTemplate] =
    useState<WorkoutTemplateSelection | null>(null)

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

  const applyTemplate = ({ template, exercises }: WorkoutTemplateSelection) => {
    form.setFieldValue('name', template.name)
    form.setFieldValue('description', template.description)
    form.setFieldValue('exercises', exercises)

    window.scrollTo({ top: 0, behavior: 'smooth' })

    const missing = template.exercises.length - exercises.length
    if (missing > 0) {
      toast.warning(
        `Template "${template.name}" aplicado. ${missing} exercício(s) não cadastrado(s) foram ignorados.`,
      )
      return
    }

    toast.success(`Template "${template.name}" aplicado`)
  }

  const selectTemplate = (selection: WorkoutTemplateSelection) => {
    if (form.state.values.exercises.length > 0) {
      setPendingTemplate(selection)
      return
    }

    applyTemplate(selection)
  }

  return (
    <div className="grid gap-6">
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

      {!isEditing && (
        <>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <WorkoutTemplates
                disabled={isSubmitting}
                onSelect={selectTemplate}
              />
            )}
          </form.Subscribe>

          <AlertDialog
            open={pendingTemplate !== null}
            onOpenChange={(open) => !open && setPendingTemplate(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Substituir exercícios atuais?</AlertDialogTitle>
                <AlertDialogDescription>
                  O nome, a descrição e os exercícios do treino serão
                  substituídos pelo template &quot;
                  {pendingTemplate?.template.name}&quot;.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (pendingTemplate) applyTemplate(pendingTemplate)
                    setPendingTemplate(null)
                  }}
                >
                  Substituir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}

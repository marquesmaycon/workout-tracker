import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'

import type { MuscleGroup } from '../../../../prisma/generated/client'
import { useMuscleGroupMutations } from '../hooks/use-muscle-group-mutations'
import { muscleGroupFormOptions } from '../validation/muscle-group.form'

type MuscleGroupFormProps = {
  muscleGroup?: MuscleGroup
}

export function MuscleGroupForm({ muscleGroup }: MuscleGroupFormProps) {
  const router = useRouter()
  const isEditing = Boolean(muscleGroup)

  const { createMuscleGroup, updateMuscleGroup } = useMuscleGroupMutations()

  const form = useAppForm({
    ...muscleGroupFormOptions(muscleGroup),
    onSubmit: async ({ value }) => {
      if (isEditing && muscleGroup) {
        await updateMuscleGroup({ id: muscleGroup.id, ...value })
        toast.success('Grupo muscular atualizado')
        return
      }

      const newMuscleGroup = await createMuscleGroup(value)
      toast.success('Grupo muscular criado')
      router.navigate({
        to: '/muscle-groups/$muscleGroupId',
        params: { muscleGroupId: newMuscleGroup.id },
      })
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
          <FieldGroup>
            <form.AppField name="name">
              {({ InputField }) => <InputField label="Nome" />}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton
                  label={
                    isEditing
                      ? 'Salvar grupo muscular'
                      : 'Criar grupo muscular'
                  }
                />
              </form.AppForm>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

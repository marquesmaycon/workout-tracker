import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'

import type { MuscleGroup } from '../../../../prisma/generated/client'
import { useMuscleGroupMutations } from '../hooks/use-muscle-group-mutations'
import { muscleGroupFormOptions } from '../validation/schemas'

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
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {isEditing ? 'Editar grupo muscular' : 'Novo grupo muscular'}
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
              {isEditing ? 'Atualize os dados' : 'Cadastre um grupo muscular'}
            </FieldSeparator>

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

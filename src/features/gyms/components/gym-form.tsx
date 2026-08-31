import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { useRouter } from '@tanstack/react-router'
import { useGymMutations } from '../hooks/use-gym-mutations'
import { gymFormOptions } from '../validation/schemas'
import type { Gym } from '../../../../prisma/generated/client'

type GymFormProps = {
  gym?: Gym
}

export function GymForm({ gym }: GymFormProps) {
  const router = useRouter()
  const isEditing = Boolean(gym)

  const { createGym, updateGym } = useGymMutations()

  const form = useAppForm({
    ...gymFormOptions(gym),
    onSubmit: async ({ value }) => {
      if (isEditing && gym) {
        await updateGym({ id: gym.id, ...value })
        toast.success('Academia atualizada')
        return
      }
      const newGym = await createGym(value)
      toast.success('Academia criada')
      router.navigate({ to: '/gyms/$gymId', params: { gymId: newGym.id } })
    },
  })

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {isEditing ? 'Editar academia' : 'Nova academia'}
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
              {isEditing ? 'Atualize os dados' : 'Cadastre uma academia'}
            </FieldSeparator>

            <form.AppField name="name">
              {({ InputField }) => <InputField label="Nome" />}
            </form.AppField>

            <form.AppField name="favorite">
              {({ CheckboxField }) => (
                <CheckboxField
                  label="Favorita"
                  description="Destacar esta academia na sua lista."
                />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton
                  label={isEditing ? 'Salvar academia' : 'Criar academia'}
                />
              </form.AppForm>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

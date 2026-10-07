import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'

import type { Gym } from '../../../../prisma/generated/client'
import { useGymMutations } from '../hooks/use-gym-mutations'
import { gymFormOptions } from '../validation/gym.form'

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
      await createGym(value)
      toast.success('Academia criada')
      router.navigate({ to: '/gyms' })
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
            <form.AppField name="name">{({ InputField }) => <InputField label="Nome" />}</form.AppField>

            <form.AppField name="favorite">
              {({ CheckboxField }) => (
                <CheckboxField label="Favorita" description="Destacar esta academia na sua lista." />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton label={isEditing ? 'Salvar academia' : 'Criar academia'} />
              </form.AppForm>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'

import type { BodyWeightLog } from '../../../../prisma/generated/client'
import { useBodyWeightMutations } from '../hooks/use-body-weight-mutations'
import { bodyWeightFormOptions } from '../validation/schemas'

type BodyWeightFormProps = {
  bodyWeight?: BodyWeightLog
}

export function BodyWeightForm({ bodyWeight }: BodyWeightFormProps) {
  const router = useRouter()
  const isEditing = Boolean(bodyWeight)

  const { createBodyWeight, updateBodyWeight } = useBodyWeightMutations()

  const form = useAppForm({
    ...bodyWeightFormOptions(bodyWeight),
    onSubmit: async ({ value }) => {
      if (isEditing && bodyWeight) {
        await updateBodyWeight({ id: bodyWeight.id, ...value })
        toast.success('Peso atualizado')
        return
      }

      const newBodyWeight = await createBodyWeight(value)
      toast.success('Peso registrado')
      router.navigate({
        to: '/body-weight/$bodyWeightId',
        params: { bodyWeightId: newBodyWeight.id },
      })
    },
  })

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {isEditing ? 'Editar peso' : 'Novo peso'}
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
              {isEditing ? 'Atualize os dados' : 'Registre seu peso corporal'}
            </FieldSeparator>

            <form.AppField name="measuredAt">
              {({ InputField }) => (
                <InputField label="Data da medicao" type="datetime-local" />
              )}
            </form.AppField>

            <form.AppField name="weight">
              {({ InputField }) => (
                <InputField label="Peso" inputMode="decimal" />
              )}
            </form.AppField>

            <form.AppField name="notes">
              {({ TextareaField }) => (
                <TextareaField label="Observacoes" rows={3} />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton
                  label={isEditing ? 'Salvar peso' : 'Registrar peso'}
                />
              </form.AppForm>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

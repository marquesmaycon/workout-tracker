import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'

import { useBodyWeightMutations } from '../hooks/use-body-weight-mutations'
import type { BodyWeight } from '../validation/body-weight.entity'
import { bodyWeightFormOptions } from '../validation/body-weight.form'

type BodyWeightFormProps = {
  bodyWeight?: BodyWeight
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

      await createBodyWeight(value)
      toast.success('Peso registrado')
      router.navigate({ to: '/body-weight' })
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

import { Link, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { authClient } from '@/lib/auth-client'

import { signupFormOptions } from '../validation/signup.schema'

export function SignupForm() {
  const router = useRouter()

  const form = useAppForm({
    ...signupFormOptions,
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signUp.email(value)

      if (error) {
        toast.error(error.message)
        return
      }

      router.navigate({ to: '/' })
    },
  })

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Nova conta</CardTitle>
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
              Crie sua conta
            </FieldSeparator>

            <form.AppField name="name">
              {({ InputField }) => <InputField label="Nome Completo" />}
            </form.AppField>

            <form.AppField name="email">
              {({ InputField }) => <InputField label="E-mail" type="email" />}
            </form.AppField>

            <form.AppField name="password">
              {({ InputField }) => <InputField label="Senha" type="password" />}
            </form.AppField>

            <form.AppField name="passwordConfirmation">
              {({ InputField }) => (
                <InputField label="Confirmação da Senha" type="password" />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton label="Cadastrar" />
              </form.AppForm>
              <FieldDescription className="text-center">
                Já tem uma conta? <Link to="/signin">Entrar</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

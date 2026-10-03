import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { authClient } from '@/lib/auth-client'

import { forgotPasswordFormOptions } from '../validation/forgot-password.form'

export function ForgotPasswordForm() {
  const form = useAppForm({
    ...forgotPasswordFormOptions,
    onSubmit: async ({ value, formApi }) => {
      await authClient.requestPasswordReset(
        { email: value.email, redirectTo: '/reset-password' },
        {
          onSuccess: () => {
            toast.success('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.')
            formApi.reset()
          },
          onError: ({ error }) => {
            toast.error(error.message)
          },
        },
      )
    },
  })

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Esqueceu sua senha?</CardTitle>
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
              Informe seu e-mail para redefinir a senha
            </FieldSeparator>

            <form.AppField name="email">{({ InputField }) => <InputField label="E-mail" type="email" />}</form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton label="Enviar link" />
              </form.AppForm>
              <FieldDescription className="text-center">
                Lembrou a senha? <Link to="/signin">Entrar</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

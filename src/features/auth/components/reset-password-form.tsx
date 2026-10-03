import { Link, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { authClient } from '@/lib/auth-client'

import { resetPasswordFormOptions } from '../validation/reset-password.form'

type ResetPasswordFormProps = {
  token?: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter()

  const form = useAppForm({
    ...resetPasswordFormOptions,
    onSubmit: async ({ value }) => {
      if (!token) return

      await authClient.resetPassword(
        { newPassword: value.password, token },
        {
          onSuccess: () => {
            toast.success('Senha redefinida com sucesso. Entre com sua nova senha.')
            router.navigate({ to: '/signin' })
          },
          onError: ({ error }) => {
            toast.error(error.message)
          },
        },
      )
    },
  })

  if (!token) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Link inválido</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldDescription className="text-center">
            O link de redefinição de senha é inválido ou expirou.{' '}
            <Link to="/forgot-password">Solicitar novo link</Link>
          </FieldDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Redefinir senha</CardTitle>
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
              Escolha uma nova senha
            </FieldSeparator>

            <form.AppField name="password">
              {({ InputField }) => <InputField label="Nova Senha" type="password" />}
            </form.AppField>

            <form.AppField name="passwordConfirmation">
              {({ InputField }) => <InputField label="Confirmação da Nova Senha" type="password" />}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton label="Redefinir senha" />
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

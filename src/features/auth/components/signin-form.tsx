import { Link, useRouter } from '@tanstack/react-router'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { authClient } from '@/lib/auth-client'

import { signinFormOptions } from '../validation/signin.validation'

export function SigninForm() {
  const router = useRouter()

  const form = useAppForm({
    ...signinFormOptions,
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email(value)

      if (error) {
        // mostrar erro no form/toast
        return
      }

      await router.navigate({ to: '/dashboard' })
    },
  })

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
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
              Entre na sua conta
            </FieldSeparator>

            <form.AppField name="email">
              {({ InputField }) => <InputField label="E-mail" type="email" />}
            </form.AppField>

            <form.AppField name="password">
              {({ InputField }) => <InputField label="Senha" type="password" />}
            </form.AppField>

            <Link
              to="."
              className="text-muted-foreground ml-auto text-xs underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </Link>

            <Field>
              <form.AppForm>
                <form.SubmitButton label="Entrar" />
              </form.AppForm>
              <FieldDescription className="text-center">
                Não tem uma conta? <Link to="/signup">Cadastre-se</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

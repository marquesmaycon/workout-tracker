import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '#/components/ui/field'
import { useAppForm } from '#/hooks/form'

import { Link, useRouter } from '@tanstack/react-router'
import { signinFormOptions } from '../validation/signin.validation'
import { authClient } from '#/lib/auth-client'

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

      await router.navigate({ to: '/gyms' })
    },
  })

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
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
              Login with your account
            </FieldSeparator>

            <form.AppField name="email">
              {({ InputField }) => <InputField label="E-mail" type="email" />}
            </form.AppField>

            <form.AppField name="password">
              {({ InputField }) => (
                <InputField label="Password" type="password" />
              )}
            </form.AppField>

            {/* <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link> */}

            <Field>
              <form.AppForm>
                <form.SubmitButton label="Login" />
              </form.AppForm>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{' '}
                <Link to="/auth/signup">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

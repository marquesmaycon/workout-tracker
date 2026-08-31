import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { Link, useRouter } from '@tanstack/react-router'
import { signupFormOptions } from '../validation/signup.schema'
import { authClient } from '@/lib/auth-client'

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
        <CardTitle className="text-xl">New account</CardTitle>
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
              Create you account
            </FieldSeparator>

            <form.AppField name="name">
              {({ InputField }) => <InputField label="Full Name" />}
            </form.AppField>

            <form.AppField name="email">
              {({ InputField }) => <InputField label="E-mail" type="email" />}
            </form.AppField>

            <form.AppField name="password">
              {({ InputField }) => (
                <InputField label="Password" type="password" />
              )}
            </form.AppField>

            <form.AppField name="passwordConfirmation">
              {({ InputField }) => (
                <InputField label="Password Confirmation" type="password" />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton label="Sign Up" />
              </form.AppForm>
              <FieldDescription className="text-center">
                Already have an account? <Link to="/auth/signin">Login</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

import { formOptions } from '@tanstack/react-form'
import type z from 'zod'
import { signupSchema } from './signup.schema'

export const signinSchema = signupSchema.pick({ email: true, password: true })

export type SigninSchema = z.infer<typeof signinSchema>

const signinDefaultValues: SigninSchema = {
  email: '',
  password: '',
}

export const signinFormOptions = formOptions({
  defaultValues: signinDefaultValues,
  validators: { onSubmit: signinSchema },
})

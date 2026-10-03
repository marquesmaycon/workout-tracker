import { formOptions } from '@tanstack/react-form'
import type z from 'zod'

import { signupBaseSchema } from './signup.form'

export const forgotPasswordSchema = signupBaseSchema.pick({ email: true })

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

const forgotPasswordDefaultValues: ForgotPasswordSchema = {
  email: '',
}

export const forgotPasswordFormOptions = formOptions({
  defaultValues: forgotPasswordDefaultValues,
  validators: { onSubmit: forgotPasswordSchema },
})

import { formOptions } from '@tanstack/react-form'
import type z from 'zod'

import { signupBaseSchema } from './signup.form'

export const resetPasswordSchema = signupBaseSchema
  .pick({ password: true, passwordConfirmation: true })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: "Passwords don't match",
    path: ['passwordConfirmation'],
  })

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

const resetPasswordDefaultValues: ResetPasswordSchema = {
  password: '',
  passwordConfirmation: '',
}

export const resetPasswordFormOptions = formOptions({
  defaultValues: resetPasswordDefaultValues,
  validators: { onSubmit: resetPasswordSchema },
})

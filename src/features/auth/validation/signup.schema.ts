import { formOptions } from '@tanstack/react-form'
import z from 'zod'

export const signupBaseSchema = z.object({
  email: z.email().lowercase(),
  password: z.string().min(8),
  name: z.string().min(3),
  passwordConfirmation: z.string(),
})

export const signupSchema = signupBaseSchema.refine(
  (data) => data.password === data.passwordConfirmation,
  {
    error: "Passwords don't match",
    path: ['passwordConfirmation'],
  },
)

export type SignupSchema = z.infer<typeof signupSchema>

const signupDefaultValues: SignupSchema = {
  email: '',
  password: '',
  name: '',
  passwordConfirmation: '',
}

export const signupFormOptions = formOptions({
  defaultValues: signupDefaultValues,
  validators: { onSubmit: signupSchema },
})

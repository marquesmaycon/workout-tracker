import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'

const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
})

export const Route = createFileRoute('/(public)/_auth/reset-password')({
  validateSearch: resetPasswordSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { token, error } = Route.useSearch()

  return <ResetPasswordForm token={error ? undefined : token} />
}

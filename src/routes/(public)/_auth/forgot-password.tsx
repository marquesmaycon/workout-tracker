import { createFileRoute } from '@tanstack/react-router'

import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'

export const Route = createFileRoute('/(public)/_auth/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ForgotPasswordForm />
}

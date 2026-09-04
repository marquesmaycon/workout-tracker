import { createFileRoute } from '@tanstack/react-router'

import { SignupForm } from '@/features/auth/components/signup-form'

export const Route = createFileRoute('/(public)/_auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignupForm />
}

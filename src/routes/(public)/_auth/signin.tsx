import { createFileRoute } from '@tanstack/react-router'

import { SigninForm } from '@/features/auth/components/signin-form'

export const Route = createFileRoute('/(public)/_auth/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SigninForm />
}

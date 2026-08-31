import { SigninForm } from '#/features/auth/components/signin-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/_auth/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SigninForm />
}

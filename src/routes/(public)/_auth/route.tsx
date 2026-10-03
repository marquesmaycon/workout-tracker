import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'

import { Logo } from '@/components/layout/logo'
import { FieldDescription } from '@/components/ui/field'
import { getSession } from '@/features/auth/server/session'

export const Route = createFileRoute('/(public)/_auth')({
  beforeLoad: async () => {
    const session = await getSession()

    if (session) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-background flex min-h-svh flex-col">
      <div className="bg-muted/35 flex flex-1 flex-col items-center justify-center gap-6 p-6 md:p-10">
        <main className="flex w-full max-w-sm flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 self-center font-medium">
            <Logo className="size-7" />
            Workout Tracker
          </Link>

          <Outlet />

          <FieldDescription className="px-6 text-center">
            Ao clicar em continuar, você concorda com nossos <br />
            <Link to=".">Termos de Serviço</Link> e <Link to=".">Política de Privacidade</Link>.
          </FieldDescription>
        </main>
      </div>
    </div>
  )
}

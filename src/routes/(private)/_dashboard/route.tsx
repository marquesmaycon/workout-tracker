import { ThemeToggler } from '@/components/theme-toggler'
import { getSession } from '@/features/auth/server/session'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/_dashboard')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (!session) {
      throw redirect({
        to: '/signin',
        search: { redirect: location.href },
      })
    }
    return { user: session.user }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col p-4 pt-0 md:p-6 md:pt-0">
      <ThemeToggler />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <Outlet />
      </main>
    </div>
  )
}

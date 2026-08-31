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
  return <Outlet />
}

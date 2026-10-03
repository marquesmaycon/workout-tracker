import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { isAdmin } from '@/lib/permissions'

export const Route = createFileRoute('/(private)/_dashboard/_admin')({
  beforeLoad: ({ context }) => {
    if (!isAdmin(context.user)) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: Outlet,
})

import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/_dashboard/gyms')({
  staticData: { breadcrumb: 'Academias' },
  component: Outlet,
})

import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/_dashboard/body-weight')({
  staticData: { breadcrumb: 'Evolução' },
  component: Outlet,
})

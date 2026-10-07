import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/_dashboard/schedules')({
  staticData: { breadcrumb: 'Programações' },
  component: Outlet,
})

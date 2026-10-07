import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/_dashboard/workouts')({
  staticData: { breadcrumb: 'Treinos' },
  component: Outlet,
})

import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/_dashboard/_admin/exercises')({
  staticData: { breadcrumb: 'Exercícios' },
  component: Outlet,
})

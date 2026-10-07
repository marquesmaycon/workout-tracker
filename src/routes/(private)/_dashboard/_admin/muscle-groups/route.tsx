import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/_dashboard/_admin/muscle-groups')({
  staticData: { breadcrumb: 'Grupos musculares' },
  component: Outlet,
})

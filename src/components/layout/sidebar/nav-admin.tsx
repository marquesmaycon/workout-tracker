import { getRouteApi } from '@tanstack/react-router'
import { BicepsFlexedIcon, LayersIcon } from 'lucide-react'

import type { NavItem } from '@/components/layout/sidebar/nav-group'
import { NavGroup } from '@/components/layout/sidebar/nav-group'
import { isAdmin } from '@/lib/permissions'

const dashboardRoute = getRouteApi('/(private)/_dashboard')

const items: NavItem[] = [
  {
    title: 'Exercícios',
    to: '/exercises',
    icon: <BicepsFlexedIcon />,
    actionLink: '/exercises/create',
  },
  {
    title: 'Grupos musculares',
    to: '/muscle-groups',
    icon: <LayersIcon />,
    actionLink: '/muscle-groups/create',
  },
]

export function NavAdmin() {
  const { user } = dashboardRoute.useRouteContext()

  if (!isAdmin(user)) {
    return null
  }

  return <NavGroup label="Administração" items={items} />
}

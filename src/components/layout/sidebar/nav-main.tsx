import { Link, useRouterState } from '@tanstack/react-router'
import {
  BicepsFlexedIcon,
  Building2Icon,
  DumbbellIcon,
  LayoutDashboardIcon,
  Plus,
  ScaleIcon,
} from 'lucide-react'

import type { FileRouteTypes } from '@/routeTree.gen'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar.tsx'

type NavItem = {
  title: string
  to: FileRouteTypes['to']
  icon?: React.ReactNode
  actionLink?: FileRouteTypes['to']
}

const items: NavItem[] = [
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: <LayoutDashboardIcon />,
  },
  {
    title: 'Academias',
    to: '/gyms',
    icon: <Building2Icon />,
    actionLink: '/gyms/create',
  },
  {
    title: 'Exercícios',
    to: '/exercises',
    icon: <BicepsFlexedIcon />,
    actionLink: '/exercises/create',
  },
  {
    title: 'Treinos',
    to: '/workouts',
    icon: <DumbbellIcon />,
    actionLink: '/workouts/create',
  },
  {
    title: 'Evolução',
    to: '/body-weight',
    icon: <ScaleIcon />,
    actionLink: '/body-weight/create',
  },
]

export function NavMain() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navegação</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActivePath(pathname, item.to)}
                render={<Link to={item.to} activeOptions={{ exact: true }} />}
              >
                {item.icon}
                <span>{item.title}</span>
                {item.actionLink && (
                  <SidebarMenuAction
                    showOnHover
                    className="aria-expanded:bg-muted"
                    render={<Link to={item.actionLink} />}
                  >
                    <Plus />
                    <span className="sr-only">Novo</span>
                  </SidebarMenuAction>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function isActivePath(pathname: string, to: FileRouteTypes['to']) {
  return pathname === to || pathname.startsWith(`${to}/`)
}

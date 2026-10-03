import { Link, useRouterState } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import type { FileRouteTypes } from '@/routeTree.gen'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '#/components/ui/sidebar.tsx'

export type NavItem = {
  title: string
  to: FileRouteTypes['to']
  icon?: React.ReactNode
  actionLink?: FileRouteTypes['to']
}

type NavGroupProps = {
  label: string
  items: NavItem[]
}

export function NavGroup({ label, items }: NavGroupProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const { setOpenMobile } = useSidebar()
  const closeMobileMenu = () => setOpenMobile(false)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActivePath(pathname, item.to)}
                render={
                  <Link
                    to={item.to}
                    activeOptions={{ exact: true }}
                    onClick={closeMobileMenu}
                  />
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
              {item.actionLink && (
                <SidebarMenuAction
                  showOnHover
                  className="aria-expanded:bg-muted"
                  render={
                    <Link to={item.actionLink} onClick={closeMobileMenu} />
                  }
                >
                  <Plus />
                  <span className="sr-only">Novo</span>
                </SidebarMenuAction>
              )}
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

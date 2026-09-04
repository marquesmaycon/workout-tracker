import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRightIcon } from 'lucide-react'
import type * as React from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible.tsx'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '#/components/ui/sidebar.tsx'

type NavRoute =
  | '/dashboard'
  | '/gyms'
  | '/gyms/create'
  | '/exercises'
  | '/exercises/create'
  | '/muscle-groups'
  | '/workouts'
  | '/workouts/create'
  | '/body-weight'
  | '/body-weight/create'

type NavMainItem = {
  title: string
  to: NavRoute
  icon?: React.ReactNode
  items?: {
    title: string
    to: NavRoute
  }[]
}

function isActivePath(pathname: string, to: NavRoute) {
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navegação</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = isActivePath(pathname, item.to)

          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  render={
                    <Link
                      to={item.to}
                      activeOptions={{ exact: item.to === '/dashboard' }}
                    />
                  }
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isActive}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    render={<Link to={item.to} />}
                  />
                }
              >
                {item.icon}
                <span>{item.title}</span>
                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        isActive={isActivePath(pathname, subItem.to)}
                        render={
                          <Link
                            to={subItem.to}
                            activeOptions={{ exact: true }}
                          />
                        }
                      >
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

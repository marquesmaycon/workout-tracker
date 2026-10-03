'use client'

import { Link } from '@tanstack/react-router'
import * as React from 'react'

import { Logo } from '@/components/layout/logo'
import { NavAdmin } from '@/components/layout/sidebar/nav-admin'
import { NavMain } from '@/components/layout/sidebar/nav-main'
import { NavSession } from '@/components/layout/sidebar/nav-session'
import { NavUser } from '@/components/layout/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '#/components/ui/sidebar.tsx'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link to="/">
                  <div className="flex aspect-square size-8 items-center justify-center">
                    <Logo className="size-7" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Workout Tracker</span>
                    <span className="text-muted-foreground text-xs">
                      v1.0.0
                    </span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSession />
        <NavMain />
        <NavAdmin />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

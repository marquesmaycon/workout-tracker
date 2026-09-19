import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'
import { ActivityIcon } from 'lucide-react'

import { orpc } from '@/orpc/client'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '#/components/ui/sidebar.tsx'

export function NavSession() {
  const { data: currentSession } = useSuspenseQuery(orpc.workoutSessions.current.queryOptions())
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const { setOpenMobile } = useSidebar()

  if (!currentSession) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Em andamento</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={currentSession.workout.name}
            isActive={pathname === `/sessions/${currentSession.id}`}
            render={
              <Link
                to="/sessions/$sessionId"
                params={{ sessionId: currentSession.id }}
                onClick={() => setOpenMobile(false)}
              />
            }
          >
            <ActivityIcon className="animate-pulse text-sky-500" />
            <span>{currentSession.workout.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

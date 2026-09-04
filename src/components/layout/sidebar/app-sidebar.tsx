'use client'

import {
  AudioLinesIcon,
  BicepsFlexedIcon,
  Building2Icon,
  DumbbellIcon,
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  ScaleIcon,
  TerminalIcon,
} from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/layout/sidebar/nav-main'
import { NavUser } from '@/components/layout/sidebar/nav-user'
import { TeamSwitcher } from '@/components/layout/sidebar/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '#/components/ui/sidebar.tsx'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: <GalleryVerticalEndIcon />,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: <AudioLinesIcon />,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: <TerminalIcon />,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      to: '/dashboard',
      icon: <LayoutDashboardIcon />,
    },
    {
      title: 'Academias',
      to: '/gyms',
      icon: <Building2Icon />,
      items: [
        {
          title: 'Todas',
          to: '/gyms',
        },
        {
          title: 'Nova academia',
          to: '/gyms/create',
        },
      ],
    },
    {
      title: 'Exercícios',
      to: '/exercises',
      icon: <BicepsFlexedIcon />,
      items: [
        {
          title: 'Todos',
          to: '/exercises',
        },
        {
          title: 'Novo exercício',
          to: '/exercises/create',
        },
        {
          title: 'Grupos musculares',
          to: '/muscle-groups',
        },
      ],
    },
    {
      title: 'Treinos',
      to: '/workouts',
      icon: <DumbbellIcon />,
      items: [
        {
          title: 'Todos',
          to: '/workouts',
        },
        {
          title: 'Novo treino',
          to: '/workouts/create',
        },
      ],
    },
    {
      title: 'Evolução',
      to: '/body-weight',
      icon: <ScaleIcon />,
      items: [
        {
          title: 'Peso corporal',
          to: '/body-weight',
        },
        {
          title: 'Novo registro',
          to: '/body-weight/create',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

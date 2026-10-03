import {
  BicepsFlexedIcon,
  Building2Icon,
  CalendarDays,
  DumbbellIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  ScaleIcon,
} from 'lucide-react'

import type { NavItem } from '@/components/layout/sidebar/nav-group'
import { NavGroup } from '@/components/layout/sidebar/nav-group'

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
  },
  {
    title: 'Treinos',
    to: '/workouts',
    icon: <DumbbellIcon />,
    actionLink: '/workouts/create',
  },
  {
    title: 'Histórico',
    to: '/exercise-log',
    icon: <HistoryIcon />,
  },
  {
    title: 'Programações',
    to: '/schedules',
    icon: <CalendarDays />,
    actionLink: '/schedules/create',
  },
  {
    title: 'Evolução',
    to: '/body-weight',
    icon: <ScaleIcon />,
    actionLink: '/body-weight/create',
  },
]

export function NavMain() {
  return <NavGroup label="Navegação" items={items} />
}

import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { Dumbbell, LayoutDashboard, Plus } from 'lucide-react'

import { ThemeToggler } from '@/components/theme-toggler'
import { getSession } from '@/features/auth/server/session'

const dashboardLinks = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    activeOptions: { exact: true },
  },
  {
    to: '/gyms/',
    label: 'Academias',
    icon: Dumbbell,
    activeOptions: { exact: true },
  },
  {
    to: '/gyms/create',
    label: 'Nova academia',
    icon: Plus,
    activeOptions: { exact: true },
  },
] as const

export const Route = createFileRoute('/(private)/_dashboard')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (!session) {
      throw redirect({
        to: '/signin',
        search: { redirect: location.href },
      })
    }
    return { user: session.user }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col px-4 pb-4 md:px-6 md:pb-6">
      <header className="sticky top-0 z-10 -mx-4 mb-6 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/dashboard"
            className="display-title text-xl font-bold text-[var(--sea-ink)] no-underline"
          >
            Workout Tracker
          </Link>

          <div className="flex items-center justify-between gap-3">
            <nav aria-label="Navegacao da dashboard" className="flex gap-1">
              {dashboardLinks.map(({ to, label, icon: Icon, activeOptions }) => (
                <Link
                  key={to}
                  to={to}
                  activeOptions={activeOptions}
                  className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-[var(--sea-ink-soft)] no-underline hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
                  activeProps={{
                    className:
                      'bg-[var(--chip-bg)] text-[var(--sea-ink)] ring-1 ring-[var(--chip-line)]',
                  }}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            <ThemeToggler />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <Outlet />
      </main>
    </div>
  )
}

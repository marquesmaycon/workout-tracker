import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AppBreadcrumb } from '@/components/layout/app-breadcrumb'
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar'
import { ThemeToggler } from '@/components/layout/theme/theme-toggler'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { getSession } from '@/features/auth/server/session'
import { orpc } from '@/orpc/client'

const currentSessionQuery = orpc.workoutSessions.current.queryOptions()


export const Route = createFileRoute('/(private)/_dashboard')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/signin', search: { redirect: location.href } })
    }
    return { user: session.user }
  },
  loader: ({ context }) =>
    context.queryClient.query({
      ...currentSessionQuery,
      staleTime: 'static',
    }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background border-b-border/33 sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <AppBreadcrumb />
          </div>
          <div className="ml-auto px-4">
            <ThemeToggler />
          </div>
        </header>
        <div className="bg-card/24 flex flex-1 flex-col p-4 pt-0 md:p-6 md:pt-0">
          <main className="container flex w-full flex-1 flex-col gap-6 pt-8">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

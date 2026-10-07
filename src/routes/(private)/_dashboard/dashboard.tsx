import 'blobatar/motion.css'
import 'blobatar/gaze.css'

import { Blobatar } from '@blobatar/react'
import { useGaze } from '@blobatar/react/gaze'
import { createFileRoute } from '@tanstack/react-router'

import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/ui/page'
import { RecentSessionsList } from '@/features/workout-sessions/components/recent-sessions-list'
import { StartWorkoutCard } from '@/features/workout-sessions/components/start-workout-card'
import { orpc } from '@/orpc/client'

const currentSessionQuery = orpc.workoutSessions.current.queryOptions()
const todayWorkoutQuery = orpc.workoutSessions.today.queryOptions()
const activeWorkoutsQuery = orpc.workouts.list.queryOptions({
  input: { isActive: true },
})
const gymsQuery = orpc.gyms.list.queryOptions()
const recentSessionsQuery = orpc.workoutSessions.recent.queryOptions()

export const Route = createFileRoute('/(private)/_dashboard/dashboard')({
  staticData: { breadcrumb: 'Dashboard' },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.query({
        ...currentSessionQuery,
        staleTime: 'static',
      }),
      context.queryClient.query({ ...todayWorkoutQuery, staleTime: 'static' }),
      context.queryClient.query({
        ...activeWorkoutsQuery,
        staleTime: 'static',
      }),
      context.queryClient.query({ ...gymsQuery, staleTime: 'static' }),
      context.queryClient.query({
        ...recentSessionsQuery,
        staleTime: 'static',
      }),
    ]),
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const { ref } = useGaze({ travel: 3, lookAt: 'pointer' })
  const firstName = user.name.split(' ')[0]

  return (
    <Page>
      <div className="flex items-center gap-4 md:gap-6">
        <Blobatar
          ref={ref}
          name={user.name}
          title={user.name}
          animate="always"
          size={128}
          className="size-24 shrink-0 md:size-32"
        />
        <PageHeader>
          <PageTitle>Olá, {firstName}!</PageTitle>
          <PageDescription>
            Continue de onde parou ou inicie um novo treino.
          </PageDescription>
        </PageHeader>
      </div>
      <StartWorkoutCard />
      <RecentSessionsList />
    </Page>
  )
}

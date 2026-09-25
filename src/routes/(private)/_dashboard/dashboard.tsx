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
  return (
    <Page>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <PageDescription>
          Continue de onde parou ou inicie um novo treino.
        </PageDescription>
      </PageHeader>
      <StartWorkoutCard />
      <RecentSessionsList />
    </Page>
  )
}

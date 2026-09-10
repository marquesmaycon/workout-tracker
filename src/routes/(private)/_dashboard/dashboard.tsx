import { createFileRoute } from '@tanstack/react-router'

import { Page, PageDescription, PageHeader, PageTitle } from '@/components/ui/page'
import { StartWorkoutCard } from '@/features/workout-sessions/components/start-workout-card'
import { orpc } from '@/orpc/client'

const currentSessionQuery = orpc.workoutSessions.current.queryOptions()
const todayWorkoutQuery = orpc.workoutSessions.today.queryOptions()
const activeWorkoutsQuery = orpc.workouts.list.queryOptions({
  input: { isActive: true },
})

export const Route = createFileRoute('/(private)/_dashboard/dashboard')({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.query(currentSessionQuery),
      context.queryClient.query(todayWorkoutQuery),
      context.queryClient.query(activeWorkoutsQuery),
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
    </Page>
  )
}

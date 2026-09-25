import { createFileRoute } from '@tanstack/react-router'

import { Page, PageDescription, PageHeader, PageTitle } from '@/components/ui/page'
import { exerciseLogFilterQueries, ExerciseLogFilters } from '@/features/exercise-log/components/exercise-log-filters'
import { ExerciseLogTable } from '@/features/exercise-log/components/exercise-log-table'
import { exerciseLogSearchSchema } from '@/features/exercise-log/validation/exercise-log.search'
import { orpc } from '@/orpc/client'

export const Route = createFileRoute('/(private)/_dashboard/exercise-log/')({
  validateSearch: exerciseLogSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    Promise.all([
      context.queryClient.query(orpc.exerciseLog.list.queryOptions({ input: deps })),
      context.queryClient.query({ ...exerciseLogFilterQueries.exercises, staleTime: 'static' }),
      context.queryClient.query({ ...exerciseLogFilterQueries.workouts, staleTime: 'static' }),
      context.queryClient.query({ ...exerciseLogFilterQueries.gyms, staleTime: 'static' }),
    ]),
  component: ExerciseLogPage,
})

function ExerciseLogPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Log de exercícios</PageTitle>
        <PageDescription>Histórico de cargas, repetições e séries dos exercícios concluídos.</PageDescription>
      </PageHeader>

      <ExerciseLogFilters />
      <ExerciseLogTable />
    </Page>
  )
}

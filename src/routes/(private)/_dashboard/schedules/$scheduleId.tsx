import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/ui/page'
import { ScheduleForm } from '@/features/schedules/components/schedule-form'
import { orpc } from '@/orpc/client'

const scheduleQuery = (id: string) =>
  orpc.schedules.get.queryOptions({ input: { id } })
const workoutsQuery = orpc.workouts.list.queryOptions({})

export const Route = createFileRoute(
  '/(private)/_dashboard/schedules/$scheduleId',
)({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.query({
        ...scheduleQuery(params.scheduleId),
        staleTime: 'static',
      }),
      context.queryClient.query({ ...workoutsQuery, staleTime: 'static' }),
    ])
  },
  component: EditSchedulePage,
})

function EditSchedulePage() {
  const { scheduleId } = Route.useParams()
  const { data: schedule } = useSuspenseQuery(scheduleQuery(scheduleId))
  const { data: workouts } = useSuspenseQuery(workoutsQuery)
  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Editar programação</PageTitle>
          <PageDescription>
            Atualize os dias e a ordem dos treinos.
          </PageDescription>
        </div>
        <Button
          variant="outline"
          render={
            <Link to="/schedules">
              <ArrowLeft aria-hidden="true" />
              Voltar
            </Link>
          }
        />
      </PageHeader>
      <ScheduleForm
        key={`${schedule.id}-${schedule.updatedAt.toISOString()}`}
        schedule={schedule}
        workouts={workouts}
      />
    </Page>
  )
}

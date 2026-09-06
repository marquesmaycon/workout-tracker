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

const workoutsQuery = orpc.workouts.list.queryOptions({})

export const Route = createFileRoute('/(private)/_dashboard/schedules/create')({
  loader: ({ context }) =>
    context.queryClient.query({ ...workoutsQuery, staleTime: 'static' }),
  component: CreateSchedulePage,
})

function CreateSchedulePage() {
  const { data: workouts } = useSuspenseQuery(workoutsQuery)
  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Nova programação</PageTitle>
          <PageDescription>
            Escolha os dias e organize sua sequência de treinos.
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
      <ScheduleForm workouts={workouts} />
    </Page>
  )
}

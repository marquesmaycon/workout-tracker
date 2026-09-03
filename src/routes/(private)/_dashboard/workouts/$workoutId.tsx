import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/ui/page'
import { WorkoutForm } from '@/features/workouts/components/workout-form'
import { orpc } from '@/orpc/client'

const workoutQueryOptions = (workoutId: string) =>
  orpc.workouts.get.queryOptions({ input: { id: workoutId } })

export const Route = createFileRoute(
  '/(private)/_dashboard/workouts/$workoutId',
)({
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...workoutQueryOptions(params.workoutId),
      staleTime: 'static',
    }),
  component: WorkoutEditPage,
})

function WorkoutEditPage() {
  const workout = Route.useLoaderData()

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Editar treino</PageTitle>
          <PageDescription>
            Atualize as informacoes principais do treino.
          </PageDescription>
        </div>

        <Button
          variant="outline"
          render={
            <Link to="/workouts">
              <ArrowLeft aria-hidden="true" />
              Voltar
            </Link>
          }
        />
      </PageHeader>

      <section className="grid w-full gap-6">
        <WorkoutForm workout={workout} />
      </section>
    </Page>
  )
}

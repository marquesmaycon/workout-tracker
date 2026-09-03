import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/ui/page'
import { ExerciseForm } from '@/features/exercises/components/exercise-form'
import { orpc } from '@/orpc/client'

const exerciseQueryOptions = (exerciseId: string) =>
  orpc.exercises.get.queryOptions({ input: { id: exerciseId } })

const muscleGroupsQueryOptions = orpc.muscleGroups.list.queryOptions()

export const Route = createFileRoute(
  '/(private)/_dashboard/exercises/$exerciseId',
)({
  loader: async ({ context, params }) => {
    const [exercise, muscleGroups] = await Promise.all([
      context.queryClient.query({
        ...exerciseQueryOptions(params.exerciseId),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...muscleGroupsQueryOptions,
        staleTime: 'static',
      }),
    ])

    return { exercise, muscleGroups }
  },
  component: ExerciseEditPage,
})

function ExerciseEditPage() {
  const { exercise, muscleGroups } = Route.useLoaderData()

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Editar exercicio</PageTitle>
          <PageDescription>
            Atualize os dados principais e os grupos musculares do exercicio.
          </PageDescription>
        </div>

        <Button
          variant="outline"
          render={
            <Link to="/exercises">
              <ArrowLeft aria-hidden="true" />
              Voltar
            </Link>
          }
        />
      </PageHeader>

      <section className="grid w-full gap-6">
        <ExerciseForm exercise={exercise} muscleGroups={muscleGroups} />
      </section>
    </Page>
  )
}

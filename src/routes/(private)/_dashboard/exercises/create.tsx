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

const muscleGroupsQueryOptions = orpc.muscleGroups.list.queryOptions()

export const Route = createFileRoute('/(private)/_dashboard/exercises/create')({
  loader: ({ context }) =>
    context.queryClient.query({
      ...muscleGroupsQueryOptions,
      staleTime: 'static',
    }),
  component: RouteComponent,
})

function RouteComponent() {
  const muscleGroups = Route.useLoaderData()

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Novo exercicio</PageTitle>
          <PageDescription>
            Adicione os dados principais e os grupos musculares do exercicio.
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
        <ExerciseForm muscleGroups={muscleGroups} />
      </section>
    </Page>
  )
}

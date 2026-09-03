import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/ui/page'
import { MuscleGroupForm } from '@/features/muscle-groups/components/muscle-group-form'
import { orpc } from '@/orpc/client'

const muscleGroupQueryOptions = (muscleGroupId: string) =>
  orpc.muscleGroups.get.queryOptions({ input: { id: muscleGroupId } })

export const Route = createFileRoute(
  '/(private)/_dashboard/muscle-groups/$muscleGroupId',
)({
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...muscleGroupQueryOptions(params.muscleGroupId),
      staleTime: 'static',
    }),
  component: MuscleGroupEditPage,
})

function MuscleGroupEditPage() {
  const muscleGroup = Route.useLoaderData()

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Editar grupo muscular</PageTitle>
          <PageDescription>
            Atualize as informacoes principais do grupo muscular.
          </PageDescription>
        </div>

        <Button
          variant="outline"
          render={
            <Link to="/muscle-groups">
              <ArrowLeft aria-hidden="true" />
              Voltar
            </Link>
          }
        />
      </PageHeader>

      <section className="grid w-full gap-6">
        <MuscleGroupForm muscleGroup={muscleGroup} />
      </section>
    </Page>
  )
}

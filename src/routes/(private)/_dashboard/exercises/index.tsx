import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Dumbbell, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/ui/page'
import { orpc } from '@/orpc/client'

const exercisesQueryOptions = orpc.exercises.list.queryOptions()

export const Route = createFileRoute('/(private)/_dashboard/exercises/')({
  loader: ({ context }) =>
    context.queryClient.query({
      ...exercisesQueryOptions,
      staleTime: 'static',
    }),
  component: ExercisesPage,
})

function ExercisesPage() {
  const { data: exercises } = useSuspenseQuery(exercisesQueryOptions)

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Exercicios</PageTitle>
          <PageDescription>
            Catalogo de exercicios para montar treinos e sessoes.
          </PageDescription>
        </div>

        <Button
          render={
            <Link to="/exercises/create">
              <Plus aria-hidden="true" />
              Novo exercicio
            </Link>
          }
        />
      </PageHeader>

      <section>
        {exercises.length > 0 ? (
          <ItemGroup>
            {exercises.map((exercise) => (
              <Item
                key={exercise.id}
                variant="muted"
                render={
                  <Link
                    to="/exercises/$exerciseId"
                    params={{ exerciseId: exercise.id }}
                  >
                    <ItemMedia variant="icon">
                      <Dumbbell aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{exercise.name}</ItemTitle>
                      <ItemDescription>
                        {formatMuscleGroups(exercise.muscleGroups)}
                      </ItemDescription>
                    </ItemContent>
                  </Link>
                }
              />
            ))}
          </ItemGroup>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Dumbbell aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Nenhum exercicio cadastrado</EmptyTitle>
              <EmptyDescription>
                Quando um exercicio for adicionado, ele vai aparecer aqui.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </section>
    </Page>
  )
}

function formatMuscleGroups(
  muscleGroups: Array<{ isPrimary: boolean; muscleGroup: { name: string } }>,
) {
  const primary = muscleGroups.find(({ isPrimary }) => isPrimary)
  const names = muscleGroups.map(({ muscleGroup }) => muscleGroup.name)

  if (names.length === 0) {
    return 'Sem grupos musculares'
  }

  return primary
    ? `${primary.muscleGroup.name} principal - ${names.length} grupo(s)`
    : names.join(', ')
}

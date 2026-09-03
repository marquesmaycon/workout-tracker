import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ClipboardList, Plus } from 'lucide-react'

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
  ItemActions,
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

const workoutsQueryOptions = orpc.workouts.list.queryOptions({})

export const Route = createFileRoute('/(private)/_dashboard/workouts/')({
  loader: ({ context }) =>
    context.queryClient.query({
      ...workoutsQueryOptions,
      staleTime: 'static',
    }),
  component: WorkoutsPage,
})

function WorkoutsPage() {
  const { data: workouts } = useSuspenseQuery(workoutsQueryOptions)

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Treinos</PageTitle>
          <PageDescription>
            Lista de treinos cadastrados para organizar sua rotina.
          </PageDescription>
        </div>

        <Button
          render={
            <Link to="/workouts/create">
              <Plus aria-hidden="true" />
              Novo treino
            </Link>
          }
        />
      </PageHeader>

      <section>
        {workouts.length > 0 ? (
          <ItemGroup>
            {workouts.map((workout) => (
              <Item
                key={workout.id}
                variant="muted"
                render={
                  <Link
                    to="/workouts/$workoutId"
                    params={{ workoutId: workout.id }}
                  >
                    <ItemMedia variant="icon">
                      <ClipboardList aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{workout.name}</ItemTitle>
                      <ItemDescription>
                        Criado em {formatDate(workout.createdAt)}
                      </ItemDescription>
                    </ItemContent>
                    {!workout.isActive ? (
                      <ItemActions>
                        <span className="bg-muted text-muted-foreground flex h-7 items-center rounded-md px-2 text-xs">
                          Inativo
                        </span>
                      </ItemActions>
                    ) : null}
                  </Link>
                }
              />
            ))}
          </ItemGroup>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClipboardList aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Nenhum treino cadastrado</EmptyTitle>
              <EmptyDescription>
                Quando um treino for adicionado, ele vai aparecer aqui.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </section>
    </Page>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BicepsFlexed, Plus } from 'lucide-react'

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

const muscleGroupsQueryOptions = orpc.muscleGroups.list.queryOptions()

export const Route = createFileRoute('/(private)/_dashboard/muscle-groups/')({
  loader: ({ context }) =>
    context.queryClient.query({
      ...muscleGroupsQueryOptions,
      staleTime: 'static',
    }),
  component: MuscleGroupsPage,
})

function MuscleGroupsPage() {
  const { data: muscleGroups } = useSuspenseQuery(muscleGroupsQueryOptions)

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Grupos musculares</PageTitle>
          <PageDescription>
            Cadastre os grupos usados para classificar exercicios.
          </PageDescription>
        </div>

        <Button
          render={
            <Link to="/muscle-groups/create">
              <Plus aria-hidden="true" />
              Novo grupo
            </Link>
          }
        />
      </PageHeader>

      <section>
        {muscleGroups.length > 0 ? (
          <ItemGroup>
            {muscleGroups.map((muscleGroup) => (
              <Item
                key={muscleGroup.id}
                variant="muted"
                render={
                  <Link
                    to="/muscle-groups/$muscleGroupId"
                    params={{ muscleGroupId: muscleGroup.id }}
                  >
                    <ItemMedia variant="icon">
                      <BicepsFlexed aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{muscleGroup.name}</ItemTitle>
                      <ItemDescription>
                        Criado em {formatDate(muscleGroup.createdAt)}
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
                <BicepsFlexed aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Nenhum grupo cadastrado</EmptyTitle>
              <EmptyDescription>
                Quando um grupo muscular for adicionado, ele vai aparecer aqui.
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

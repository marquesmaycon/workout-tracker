import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Dumbbell, Plus, Star } from 'lucide-react'

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

const gymsQueryOptions = orpc.gyms.list.queryOptions({})

export const Route = createFileRoute('/(private)/_dashboard/gyms/')({
  loader: ({ context }) =>
    context.queryClient.query({ ...gymsQueryOptions, staleTime: 'static' }),
  component: GymsPage,
})

function GymsPage() {
  const { data: gyms } = useSuspenseQuery(gymsQueryOptions)

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Academias</PageTitle>
          <PageDescription>
            Lista das academias cadastradas para organizar seus treinos.
          </PageDescription>
        </div>

        <Button
          render={
            <Link to="/gyms/create">
              <Plus aria-hidden="true" />
              Nova academia
            </Link>
          }
        />
      </PageHeader>

      <section>
        {gyms.length > 0 ? (
          <ItemGroup>
            {gyms.map((gym) => (
              <Item
                key={gym.id}
                variant="muted"
                render={
                  <Link to="/gyms/$gymId" params={{ gymId: gym.id }}>
                    <ItemMedia variant="icon">
                      <Dumbbell aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{gym.name}</ItemTitle>
                      <ItemDescription>
                        Criada em {formatDate(gym.createdAt)}
                      </ItemDescription>
                    </ItemContent>
                    {gym.favorite ? (
                      <ItemActions>
                        <span
                          aria-label="Academia favorita"
                          title="Academia favorita"
                          className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-md text-amber-500"
                        >
                          <Star
                            aria-hidden="true"
                            className="size-4 fill-current"
                          />
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
                <Dumbbell aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Nenhuma academia cadastrada</EmptyTitle>
              <EmptyDescription>
                Quando uma academia for adicionada, ela vai aparecer nesta
                lista.
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

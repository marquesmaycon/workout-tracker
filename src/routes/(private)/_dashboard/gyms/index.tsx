import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Dumbbell, Star } from 'lucide-react'

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
  const favoriteGyms = gyms.filter((gym) => gym.favorite)

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Academias</PageTitle>
          <PageDescription>
            Lista das academias cadastradas para organizar seus treinos.
          </PageDescription>
        </div>

        <div className="flex gap-2">
          <SummaryPill label="Total" value={gyms.length} />
          <SummaryPill label="Favoritas" value={favoriteGyms.length} />
        </div>
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
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Dumbbell
              aria-hidden="true"
              className="text-muted-foreground mx-auto size-8"
            />
            <h2 className="mt-4 text-lg font-semibold">
              Nenhuma academia cadastrada
            </h2>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
              Quando uma academia for adicionada, ela vai aparecer nesta lista.
            </p>
          </div>
        )}
      </section>
    </Page>
  )
}

function SummaryPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-muted/50 min-w-24 rounded-md border px-3 py-2">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

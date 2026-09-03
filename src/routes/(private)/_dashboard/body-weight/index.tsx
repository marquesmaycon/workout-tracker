import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus, Scale } from 'lucide-react'

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

const bodyWeightQueryOptions = orpc.bodyWeight.list.queryOptions()

export const Route = createFileRoute('/(private)/_dashboard/body-weight/')({
  loader: ({ context }) =>
    context.queryClient.query({
      ...bodyWeightQueryOptions,
      staleTime: 'static',
    }),
  component: BodyWeightPage,
})

function BodyWeightPage() {
  const { data: bodyWeightLogs } = useSuspenseQuery(bodyWeightQueryOptions)

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Peso corporal</PageTitle>
          <PageDescription>
            Historico de medicoes de peso corporal.
          </PageDescription>
        </div>

        <Button
          render={
            <Link to="/body-weight/create">
              <Plus aria-hidden="true" />
              Novo peso
            </Link>
          }
        />
      </PageHeader>

      <section>
        {bodyWeightLogs.length > 0 ? (
          <ItemGroup>
            {bodyWeightLogs.map((bodyWeight) => (
              <Item
                key={bodyWeight.id}
                variant="muted"
                render={
                  <Link
                    to="/body-weight/$bodyWeightId"
                    params={{ bodyWeightId: bodyWeight.id }}
                  >
                    <ItemMedia variant="icon">
                      <Scale aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{formatWeight(bodyWeight.weight)} kg</ItemTitle>
                      <ItemDescription>
                        Medido em {formatDate(bodyWeight.measuredAt)}
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
                <Scale aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Nenhum peso registrado</EmptyTitle>
              <EmptyDescription>
                Quando uma medicao for adicionada, ela vai aparecer aqui.
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

function formatWeight(weight: unknown) {
  return String(weight)
}

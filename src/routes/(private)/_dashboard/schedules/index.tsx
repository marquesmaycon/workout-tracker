import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarDays, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item'
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/ui/page'
import { weekdayOptions } from '@/features/schedules/validation/schemas'
import { orpc } from '@/orpc/client'

const schedulesQuery = orpc.schedules.list.queryOptions({})

export const Route = createFileRoute('/(private)/_dashboard/schedules/')({
  loader: ({ context }) =>
    context.queryClient.query({ ...schedulesQuery, staleTime: 'static' }),
  component: SchedulesPage,
})

function SchedulesPage() {
  const { data: schedules } = useSuspenseQuery(schedulesQuery)
  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Programações</PageTitle>
          <PageDescription>
            Seus dias de treino e sequências para continuar de onde parou.
          </PageDescription>
        </div>
        <Button
          render={
            <Link to="/schedules/create">
              <Plus aria-hidden="true" />
              Nova programação
            </Link>
          }
        />
      </PageHeader>
      {schedules.length ? (
        <ItemGroup>
          {schedules.map((schedule) => (
            <Item
              key={schedule.id}
              variant="muted"
              render={
                <Link
                  to="/schedules/$scheduleId"
                  params={{ scheduleId: schedule.id }}
                />
              }
            >
              <CalendarDays aria-hidden="true" className="size-5 shrink-0" />
              <ItemContent className="min-w-0">
                <ItemTitle className="flex-wrap">
                  {schedule.name}
                  <span className="bg-background rounded-md px-2 py-1 text-xs">
                    {schedule.isActive ? 'Ativa' : 'Inativa'}
                  </span>
                </ItemTitle>
                <p className="text-muted-foreground text-sm">
                  {weekdayOptions
                    .filter((day) => schedule.weekdays.includes(day.value))
                    .map((day) => day.short)
                    .join(' · ')}
                </p>
                <p className="text-sm break-words">
                  {schedule.items.map((item) => item.workout.name).join(' → ')}
                </p>
                {schedule.items.some((item) => !item.workout.isActive) && (
                  <p className="text-destructive text-sm">
                    Há treinos inativos nesta programação.
                  </p>
                )}
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarDays />
            </EmptyMedia>
            <EmptyTitle>Nenhuma programação cadastrada</EmptyTitle>
            <EmptyDescription>
              Crie uma programação com seus treinos e os dias em que pretende
              treinar.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </Page>
  )
}

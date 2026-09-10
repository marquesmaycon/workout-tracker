import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Dumbbell, Play } from 'lucide-react'

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
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { orpc } from '@/orpc/client'

const activeWorkoutsQuery = orpc.workouts.list.queryOptions({
  input: { isActive: true },
})

export function ActiveWorkoutsPicker({
  onStart,
}: {
  onStart: (workoutId: string) => void
}) {
  const { data: workouts } = useSuspenseQuery(activeWorkoutsQuery)

  if (!workouts.length) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Dumbbell />
          </EmptyMedia>
          <EmptyTitle>Nenhum treino ativo</EmptyTitle>
          <EmptyDescription>
            Crie um treino para começar a registrar suas sessões.{' '}
            <Link to="/workouts/create">Criar treino</Link>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-3">
      <h2 className="font-heading text-sm font-medium">
        Escolha um treino para iniciar
      </h2>
      <ItemGroup>
        {workouts.map((workout) => (
          <Item key={workout.id} variant="muted">
            <ItemContent>
              <ItemTitle>{workout.name}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button size="sm" onClick={() => onStart(workout.id)}>
                <Play aria-hidden="true" />
                Iniciar
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}

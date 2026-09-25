import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Dumbbell, Play } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
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
  const { data: currentSession } = useSuspenseQuery(
    orpc.workoutSessions.current.queryOptions(),
  )

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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {workouts.map((workout) => (
          <Card key={workout.id} size="sm">
            <CardHeader>
              <CardTitle className="line-clamp-1">{workout.name}</CardTitle>
              <CardDescription>
                {workout.exercises.length}{' '}
                {workout.exercises.length === 1 ? 'exercício' : 'exercícios'}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button
                size="sm"
                className="w-full"
                onClick={() => onStart(workout.id)}
                disabled={!!currentSession}
              >
                <Play aria-hidden="true" />
                Iniciar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { History } from 'lucide-react'

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
  ItemTitle,
} from '@/components/ui/item'
import { orpc } from '@/orpc/client'

import type { RecentWorkoutSession } from '../validation/workout-session.entity'

const recentSessionsQuery = orpc.workoutSessions.recent.queryOptions()

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function RecentSessionsList() {
  const { data: sessions } = useSuspenseQuery(recentSessionsQuery)

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-sm font-medium">Últimos treinos</h2>
        {sessions.length > 0 && (
          <Button
            variant="link"
            size="sm"
            render={<Link to="/exercise-log">Ver histórico completo</Link>}
          />
        )}
      </div>

      {sessions.length ? (
        <ItemGroup>
          {sessions.map((session) => (
            <Item key={session.id} variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>{session.workout.name}</ItemTitle>
                <ItemDescription>{describeSession(session)}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="outline"
                  size="sm"
                  render={
                    <Link
                      to="/exercise-log"
                      search={{ workoutSessionId: session.id }}
                    >
                      <History aria-hidden="true" />
                      Ver logs
                    </Link>
                  }
                />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <History />
            </EmptyMedia>
            <EmptyTitle>Nenhum treino finalizado</EmptyTitle>
            <EmptyDescription>
              Os treinos que você concluir aparecerão aqui.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}

function describeSession(session: RecentWorkoutSession) {
  const exercises = `${session.exerciseCount} ${session.exerciseCount === 1 ? 'exercício' : 'exercícios'}`
  const duration = formatDuration(session.startedAt, session.finishedAt)

  return [
    dateFormatter.format(session.finishedAt),
    duration,
    exercises,
    session.gym?.name,
  ]
    .filter(Boolean)
    .join(' · ')
}

function formatDuration(start: Date, end: Date) {
  const minutes = Math.round((end.getTime() - start.getTime()) / 60_000)
  if (minutes < 1) return null
  if (minutes < 60) return `${minutes} min`

  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}min` : `${hours}h`
}

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { CheckCircle2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/ui/page'
import { SessionExerciseCard } from '@/features/workout-sessions/components/session-exercise-card'
import { useWorkoutSessionMutations } from '@/features/workout-sessions/hooks/use-workout-session-mutations'
import { orpc } from '@/orpc/client'

const sessionQueryOptions = (id: string) =>
  orpc.workoutSessions.get.queryOptions({ input: { id } })

export const Route = createFileRoute(
  '/(private)/_dashboard/sessions/$sessionId',
)({
  loader: ({ context, params }) =>
    context.queryClient.query(sessionQueryOptions(params.sessionId)),
  component: SessionPage,
})

function SessionPage() {
  const { sessionId } = Route.useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSuspenseQuery(sessionQueryOptions(sessionId))
  const { finishWorkoutSession, cancelWorkoutSession } =
    useWorkoutSessionMutations()

  const isInProgress = session.status === 'IN_PROGRESS'

  const handleFinish = async () => {
    try {
      await finishWorkoutSession({ id: session.id })
      toast.success('Treino finalizado')
      router.navigate({ to: '/dashboard' })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível finalizar o treino.',
      )
    }
  }

  const handleCancel = async () => {
    try {
      await cancelWorkoutSession({ id: session.id })
      toast.success('Treino cancelado')
      router.navigate({ to: '/dashboard' })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível cancelar o treino.',
      )
    }
  }

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>{session.workout.name}</PageTitle>
          <PageDescription>
            Iniciado em {new Date(session.startedAt).toLocaleString('pt-BR')}
            {session.gym ? ` · ${session.gym.name}` : ''}
          </PageDescription>
        </div>

        {isInProgress && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X aria-hidden="true" />
              Cancelar treino
            </Button>
            <Button onClick={handleFinish}>
              <CheckCircle2 aria-hidden="true" />
              Finalizar treino
            </Button>
          </div>
        )}
      </PageHeader>

      <ol className="flex flex-col gap-3">
        {session.exercises.map((exercise) => (
          <li key={exercise.id}>
            <SessionExerciseCard
              exercise={exercise}
              readOnly={!isInProgress}
              onSaved={() =>
                queryClient.invalidateQueries(sessionQueryOptions(sessionId))
              }
            />
          </li>
        ))}
      </ol>
    </Page>
  )
}

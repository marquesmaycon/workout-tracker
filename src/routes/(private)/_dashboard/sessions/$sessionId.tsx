import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { CheckCircle2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Page, PageDescription, PageHeader, PageTitle } from '@/components/ui/page'
import { SessionExerciseCard } from '@/features/workout-sessions/components/session-exercise-card'
import { useSessionExerciseSaver } from '@/features/workout-sessions/hooks/use-session-exercise-saver'
import { useEndWorkoutSession } from '@/features/workout-sessions/hooks/use-workout-session-mutations'
import { orpc } from '@/orpc/client'

const sessionQueryOptions = (id: string) => orpc.workoutSessions.get.queryOptions({ input: { id } })

export const Route = createFileRoute('/(private)/_dashboard/sessions/$sessionId')({
  loader: ({ context, params }) => context.queryClient.query(sessionQueryOptions(params.sessionId)),
  component: SessionPage,
})

function SessionPage() {
  const { sessionId } = Route.useParams()
  const router = useRouter()

  const { data: session } = useSuspenseQuery(sessionQueryOptions(sessionId))
  const { saveExercise, registerFlush, flushPending } = useSessionExerciseSaver(session)
  const { finishWorkoutSession, cancelWorkoutSession, isFinishing, isCancelling } = useEndWorkoutSession(session.id)

  const endSession = async (action: () => Promise<unknown>, successMessage: string, fallbackError: string) => {
    flushPending()
    try {
      await action()
      toast.success(successMessage)
      router.navigate({ to: '/dashboard' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : fallbackError)
    }
  }

  const handleFinish = () =>
    endSession(
      () => finishWorkoutSession({ id: session.id }),
      'Treino finalizado',
      'Não foi possível finalizar o treino.',
    )

  const handleCancel = () =>
    endSession(
      () => cancelWorkoutSession({ id: session.id }),
      'Treino cancelado',
      'Não foi possível cancelar o treino.',
    )

  const isInProgress = session.status === 'IN_PROGRESS'

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
      </PageHeader>

      <p className="font-heading">Exercícios do dia</p>

      <Accordion multiple defaultValue={session.exercises.map((exercise) => exercise.id)}>
        {session.exercises.map((exercise) => (
          <SessionExerciseCard
            key={exercise.id}
            exercise={exercise}
            onSave={saveExercise}
            registerFlush={registerFlush}
          />
        ))}
      </Accordion>

      {isInProgress && (
        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            loading={isCancelling}
            disabled={isFinishing || isCancelling}
          >
            <X aria-hidden="true" />
            Cancelar treino
          </Button>
          <Button onClick={handleFinish} loading={isFinishing} disabled={isFinishing || isCancelling}>
            <CheckCircle2 aria-hidden="true" />
            Finalizar treino
          </Button>
        </div>
      )}
    </Page>
  )
}

import { useIsMutating, useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

const sessionQueryKey = (sessionId: string) => orpc.workoutSessions.get.queryKey({ input: { id: sessionId } })

// Mutations da mesma sessão rodam em série: um save nunca é ultrapassado por outro
// save nem pelo finish/cancel, e as respostas chegam ao cache na ordem em que foram enviadas.
const sessionScope = (sessionId: string) => ({ id: `workout-session-${sessionId}` })

export const useStartWorkoutSession = () => {
  const { mutateAsync } = useMutation(
    orpc.workoutSessions.start.mutationOptions({
      onSettled: (_, __, ___, ____, { client }) => {
        client.invalidateQueries(orpc.workoutSessions.current.queryOptions())
        client.invalidateQueries(orpc.workoutSessions.today.queryOptions())
      },
    }),
  )

  return mutateAsync
}

export const useIsStartingWorkoutSession = () =>
  useIsMutating({ mutationKey: orpc.workoutSessions.start.mutationKey() }) > 0

export const useUpdateSessionExercise = (sessionId: string) => {
  const { mutateAsync } = useMutation(
    orpc.workoutSessions.updateExercise.mutationOptions({
      scope: sessionScope(sessionId),
      // A resposta já traz a sessão completa: grava no cache em vez de refazer o GET
      onSuccess: (session, _, __, { client }) => {
        client.setQueryData(sessionQueryKey(sessionId), session)
      },
    }),
  )

  return mutateAsync
}

export const useEndWorkoutSession = (sessionId: string) => {
  const { mutateAsync: finishWorkoutSession, isPending: isFinishing } = useMutation(
    orpc.workoutSessions.finish.mutationOptions({
      scope: sessionScope(sessionId),
      onSuccess: (session, _, __, { client }) => {
        client.setQueryData(sessionQueryKey(sessionId), session)
      },
      onSettled: (_, __, ___, ____, { client }) => {
        client.invalidateQueries(orpc.workoutSessions.current.queryOptions())
      },
    }),
  )

  const { mutateAsync: cancelWorkoutSession, isPending: isCancelling } = useMutation(
    orpc.workoutSessions.cancel.mutationOptions({
      scope: sessionScope(sessionId),
      onSuccess: (session, _, __, { client }) => {
        client.setQueryData(sessionQueryKey(sessionId), session)
      },
      onSettled: (_, __, ___, ____, { client }) => {
        client.invalidateQueries(orpc.workoutSessions.current.queryOptions())
      },
    }),
  )

  return { finishWorkoutSession, cancelWorkoutSession, isFinishing, isCancelling }
}

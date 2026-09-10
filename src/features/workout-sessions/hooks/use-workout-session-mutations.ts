import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useWorkoutSessionMutations = () => {
  const { mutateAsync: startWorkoutSession } = useMutation(
    orpc.workoutSessions.start.mutationOptions({
      onSettled: (_, __, ___, ____, { client }) => {
        client.invalidateQueries(orpc.workoutSessions.current.queryOptions())
        client.invalidateQueries(orpc.workoutSessions.today.queryOptions())
      },
    }),
  )

  const { mutateAsync: updateSessionExercise } = useMutation(
    orpc.workoutSessions.updateExercise.mutationOptions(),
  )

  const { mutateAsync: finishWorkoutSession } = useMutation(
    orpc.workoutSessions.finish.mutationOptions({
      onSettled: (_, __, ___, ____, { client }) => {
        client.invalidateQueries(orpc.workoutSessions.current.queryOptions())
      },
    }),
  )

  const { mutateAsync: cancelWorkoutSession } = useMutation(
    orpc.workoutSessions.cancel.mutationOptions({
      onSettled: (_, __, ___, ____, { client }) => {
        client.invalidateQueries(orpc.workoutSessions.current.queryOptions())
      },
    }),
  )

  return {
    startWorkoutSession,
    updateSessionExercise,
    finishWorkoutSession,
    cancelWorkoutSession,
  }
}

import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useWorkoutMutations = () => {
  const { mutateAsync: createWorkout } = useMutation(
    orpc.workouts.create.mutationOptions({
      onSettled: (_, __, ___, ____, { client }) => {
        client.invalidateQueries(orpc.workouts.list.queryOptions())
      },
    }),
  )

  const { mutateAsync: updateWorkout } = useMutation(
    orpc.workouts.update.mutationOptions({
      onSettled: (_, __, vars, ____, { client }) => {
        client.invalidateQueries(orpc.workouts.list.queryOptions())
        client.invalidateQueries(
          orpc.workouts.get.queryOptions({ input: { id: vars.id } }),
        )
      },
    }),
  )

  return { createWorkout, updateWorkout }
}

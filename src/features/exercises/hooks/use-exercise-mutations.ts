import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useExerciseMutations = () => {
  const { mutateAsync: createExercise } = useMutation(
    orpc.exercises.create.mutationOptions({
      onSettled: (_, __, ___, ____, { client }) => {
        client.invalidateQueries(orpc.exercises.list.queryOptions())
      },
    }),
  )

  const { mutateAsync: updateExercise } = useMutation(
    orpc.exercises.update.mutationOptions({
      onSettled: (_, __, vars, ____, { client }) => {
        client.invalidateQueries(orpc.exercises.list.queryOptions())
        client.invalidateQueries(
          orpc.exercises.get.queryOptions({ input: { id: vars.id } }),
        )
      },
    }),
  )

  return { createExercise, updateExercise }
}

import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useMuscleGroupMutations = () => {
  const { mutateAsync: createMuscleGroup } = useMutation(
    orpc.muscleGroups.create.mutationOptions({
      onSettled: (_, __, ___, ____, { client }) => {
        client.invalidateQueries(orpc.muscleGroups.list.queryOptions())
      },
    }),
  )

  const { mutateAsync: updateMuscleGroup } = useMutation(
    orpc.muscleGroups.update.mutationOptions({
      onSettled: (_, __, vars, ____, { client }) => {
        client.invalidateQueries(orpc.muscleGroups.list.queryOptions())
        client.invalidateQueries(
          orpc.muscleGroups.get.queryOptions({ input: { id: vars.id } }),
        )
      },
    }),
  )

  return { createMuscleGroup, updateMuscleGroup }
}

import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useBodyWeightMutations = () => {
  const { mutateAsync: createBodyWeight } = useMutation(
    orpc.bodyWeight.create.mutationOptions({
      onSettled: (_, __, ___, ____, { client }) => {
        client.invalidateQueries(orpc.bodyWeight.list.queryOptions())
      },
    }),
  )

  const { mutateAsync: updateBodyWeight } = useMutation(
    orpc.bodyWeight.update.mutationOptions({
      onSettled: (_, __, vars, ____, { client }) => {
        client.invalidateQueries(orpc.bodyWeight.list.queryOptions())
        client.invalidateQueries(
          orpc.bodyWeight.get.queryOptions({ input: { id: vars.id } }),
        )
      },
    }),
  )

  return { createBodyWeight, updateBodyWeight }
}

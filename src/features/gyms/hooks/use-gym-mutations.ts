import { orpc } from '@/orpc/client'
import { useMutation } from '@tanstack/react-query'

export const useGymMutations = () => {
  const { mutateAsync: createGym } = useMutation(
    orpc.gyms.create.mutationOptions({
      onSettled: (_, __, ___, ____, { client }) => {
        client.invalidateQueries(orpc.gyms.list.queryOptions())
      },
    }),
  )

  const { mutateAsync: updateGym } = useMutation(
    orpc.gyms.update.mutationOptions({
      onSettled: (_, __, vars, ____, { client }) => {
        client.invalidateQueries(orpc.gyms.list.queryOptions())
        client.invalidateQueries(
          orpc.gyms.get.queryOptions({ input: { id: vars.id } }),
        )
      },
    }),
  )

  return { createGym, updateGym }
}

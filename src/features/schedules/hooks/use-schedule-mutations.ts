import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useScheduleMutations() {
  const { mutateAsync: createSchedule } = useMutation(
    orpc.schedules.create.mutationOptions({
      onSuccess: (_, __, ___, { client }) => {
        client.invalidateQueries({ queryKey: orpc.schedules.key() })
      },
    }),
  )
  const { mutateAsync: updateSchedule } = useMutation(
    orpc.schedules.update.mutationOptions({
      onSuccess: (_, __, ___, { client }) => {
        client.invalidateQueries({ queryKey: orpc.schedules.key() })
      },
    }),
  )
  return { createSchedule, updateSchedule }
}

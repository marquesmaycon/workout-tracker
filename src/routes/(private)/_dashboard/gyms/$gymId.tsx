import { createFileRoute } from '@tanstack/react-router'

import { GymForm } from '@/features/gyms/components/gym-form'
import { orpc } from '@/orpc/client'

const gymQueryOptions = (gymId: string) =>
  orpc.gyms.get.queryOptions({ input: { id: gymId } })

export const Route = createFileRoute('/(private)/_dashboard/gyms/$gymId')({
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...gymQueryOptions(params.gymId),
      staleTime: 'static',
    }),
  component: GymEditPage,
})

function GymEditPage() {
  const gym = Route.useLoaderData()

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar academia
        </h1>
        <p className="text-muted-foreground text-sm">
          Atualize as informacoes principais da academia.
        </p>
      </div>

      <section className="grid w-full gap-6">
        <GymForm gym={gym} />
      </section>
    </>
  )
}

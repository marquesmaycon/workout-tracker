import { createFileRoute } from '@tanstack/react-router'

import { GymForm } from '@/features/gyms/components/gym-form'

export const Route = createFileRoute('/(private)/_dashboard/gyms/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Nova academia</h1>
        <p className="text-muted-foreground text-sm">
          Adicione as informacoes principais da academia.
        </p>
      </div>

      <section className="grid w-full gap-6">
        <GymForm />
      </section>
    </>
  )
}

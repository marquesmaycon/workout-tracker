import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/ui/page'
import { WorkoutForm } from '@/features/workouts/components/workout-form'

export const Route = createFileRoute('/(private)/_dashboard/workouts/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Novo treino</PageTitle>
          <PageDescription>
            Adicione as informacoes principais do treino.
          </PageDescription>
        </div>

        <Button
          variant="outline"
          render={
            <Link to="/workouts">
              <ArrowLeft aria-hidden="true" />
              Voltar
            </Link>
          }
        />
      </PageHeader>

      <section className="grid w-full gap-6">
        <WorkoutForm />
      </section>
    </Page>
  )
}

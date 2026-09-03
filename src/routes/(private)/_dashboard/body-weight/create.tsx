import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/ui/page'
import { BodyWeightForm } from '@/features/body-weight/components/body-weight-form'

export const Route = createFileRoute(
  '/(private)/_dashboard/body-weight/create',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Novo peso</PageTitle>
          <PageDescription>
            Registre a data, o peso e observacoes da medicao.
          </PageDescription>
        </div>

        <Button
          variant="outline"
          render={
            <Link to="/body-weight">
              <ArrowLeft aria-hidden="true" />
              Voltar
            </Link>
          }
        />
      </PageHeader>

      <section className="grid w-full gap-6">
        <BodyWeightForm />
      </section>
    </Page>
  )
}

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
import { orpc } from '@/orpc/client'

const bodyWeightQueryOptions = (bodyWeightId: string) =>
  orpc.bodyWeight.get.queryOptions({ input: { id: bodyWeightId } })

export const Route = createFileRoute(
  '/(private)/_dashboard/body-weight/$bodyWeightId',
)({
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...bodyWeightQueryOptions(params.bodyWeightId),
      staleTime: 'static',
    }),
  component: BodyWeightEditPage,
})

function BodyWeightEditPage() {
  const bodyWeight = Route.useLoaderData()

  return (
    <Page>
      <PageHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <PageTitle>Editar peso</PageTitle>
          <PageDescription>
            Atualize a data, o peso e observacoes da medicao.
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
        <BodyWeightForm bodyWeight={bodyWeight} />
      </section>
    </Page>
  )
}

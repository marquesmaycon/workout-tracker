import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Dumbbell, Star } from 'lucide-react'

import { orpc } from '#/orpc/client'

const gymsQueryOptions = orpc.gyms.list.queryOptions({})

export const Route = createFileRoute('/gyms')({
  loader: ({ context }) =>
    context.queryClient.query({ ...gymsQueryOptions, staleTime: 'static' }),
  component: GymsPage,
})

function GymsPage() {
  const { data: gyms } = useSuspenseQuery(gymsQueryOptions)
  const favoriteGyms = gyms.filter((gym) => gym.favorite)

  return (
    <main className="page-wrap py-8 sm:py-12">
      <section className="island-shell rounded-lg p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="island-kicker">Gyms</p>
            <h1 className="display-title mt-2 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
              Academias
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--sea-ink-soft)]">
              Lista das academias cadastradas para organizar seus treinos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <SummaryPill label="Total" value={gyms.length} />
            <SummaryPill label="Favoritas" value={favoriteGyms.length} />
          </div>
        </div>
      </section>

      <section className="mt-5">
        {gyms.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gyms.map((gym) => (
              <li
                key={gym.id}
                className="feature-card rounded-lg border border-[var(--line)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--line)] bg-white/70 text-[var(--lagoon-deep)]">
                      <Dumbbell aria-hidden="true" className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-[var(--sea-ink)]">
                        {gym.name}
                      </h2>
                      <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
                        Criada em {formatDate(gym.createdAt)}
                      </p>
                    </div>
                  </div>

                  {gym.favorite ? (
                    <span
                      aria-label="Academia favorita"
                      title="Academia favorita"
                      className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[var(--chip-bg)] text-amber-500 ring-1 ring-[var(--chip-line)]"
                    >
                      <Star
                        aria-hidden="true"
                        className="size-4 fill-current"
                      />
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="island-shell rounded-lg p-8 text-center">
            <Dumbbell
              aria-hidden="true"
              className="mx-auto size-8 text-[var(--lagoon-deep)]"
            />
            <h2 className="mt-4 text-lg font-semibold text-[var(--sea-ink)]">
              Nenhuma academia cadastrada
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--sea-ink-soft)]">
              Quando uma academia for adicionada, ela vai aparecer nesta lista.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

function SummaryPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-2">
      <p className="text-xs text-[var(--sea-ink-soft)]">{label}</p>
      <p className="text-xl font-bold text-[var(--sea-ink)]">{value}</p>
    </div>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

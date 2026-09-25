import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { FilterX, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { orpc } from '@/orpc/client'

import type { ExerciseLogFilterKey } from '../validation/exercise-log.search'

const routeApi = getRouteApi('/(private)/_dashboard/exercise-log/')

export const exerciseLogFilterQueries = {
  exercises: orpc.exercises.list.queryOptions(),
  workouts: orpc.workouts.list.queryOptions(),
  gyms: orpc.gyms.list.queryOptions(),
}

type FilterOption = { value: string | null; label: string }

export function ExerciseLogFilters() {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const { data: exercises } = useSuspenseQuery(exerciseLogFilterQueries.exercises)
  const { data: workouts } = useSuspenseQuery(exerciseLogFilterQueries.workouts)
  const { data: gyms } = useSuspenseQuery(exerciseLogFilterQueries.gyms)

  const hasFilters = Boolean(
    search.exerciseId || search.workoutId || search.gymId || search.from || search.to || search.workoutSessionId,
  )

  function setFilter(key: ExerciseLogFilterKey, value: string | null) {
    void navigate({
      search: (prev) => ({ ...prev, [key]: value || undefined, page: 1 }),
      replace: true,
    })
  }

  function clearFilters() {
    void navigate({
      search: (prev) => ({
        ...prev,
        exerciseId: undefined,
        workoutId: undefined,
        gymId: undefined,
        from: undefined,
        to: undefined,
        workoutSessionId: undefined,
        page: 1,
      }),
      replace: true,
    })
  }

  return (
    <div className="grid gap-3">
      {search.workoutSessionId && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Filtrando por uma sessão de treino</Badge>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Remover filtro de sessão"
            onClick={() => setFilter('workoutSessionId', null)}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto] lg:items-end">
      <FilterSelect
        id="exercise-log-exercise"
        label="Exercício"
        value={search.exerciseId}
        options={exercises.map(({ id, name }) => ({ value: id, label: name }))}
        onChange={(value) => setFilter('exerciseId', value)}
      />
      <FilterSelect
        id="exercise-log-workout"
        label="Treino"
        value={search.workoutId}
        options={workouts.map(({ id, name }) => ({ value: id, label: name }))}
        onChange={(value) => setFilter('workoutId', value)}
      />
      <FilterSelect
        id="exercise-log-gym"
        label="Academia"
        value={search.gymId}
        options={gyms.map(({ id, name }) => ({ value: id, label: name }))}
        onChange={(value) => setFilter('gymId', value)}
      />

      <div className="grid gap-1.5">
        <Label htmlFor="exercise-log-from">De</Label>
        <Input
          id="exercise-log-from"
          type="date"
          value={search.from ?? ''}
          max={search.to}
          onChange={(event) => setFilter('from', event.target.value)}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="exercise-log-to">Até</Label>
        <Input
          id="exercise-log-to"
          type="date"
          value={search.to ?? ''}
          min={search.from}
          onChange={(event) => setFilter('to', event.target.value)}
        />
      </div>

      <Button variant="ghost" disabled={!hasFilters} onClick={clearFilters}>
        <FilterX aria-hidden="true" />
        Limpar filtros
      </Button>
      </div>
    </div>
  )
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string | undefined
  options: Array<{ value: string; label: string }>
  onChange: (value: string | null) => void
}) {
  const items: Array<FilterOption> = [{ value: null, label: 'Todos' }, ...options]

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select items={items} value={value ?? null} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value ?? 'all'} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

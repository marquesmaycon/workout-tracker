import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'

import type { DataTableFeatures } from '@/components/data-table/features'

import type { ExerciseLogEntry } from '../validation/exercise-log.entity'

const columnHelper = createColumnHelper<DataTableFeatures, ExerciseLogEntry>()

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

export const exerciseLogColumns = columnHelper.columns([
  columnHelper.accessor('date', {
    id: 'date',
    header: 'Data',
    cell: ({ row, getValue }) => (
      <Link
        to="/sessions/$sessionId"
        params={{ sessionId: row.original.workoutSessionId }}
        className="underline-offset-4 hover:underline"
      >
        {dateFormatter.format(getValue())}
      </Link>
    ),
  }),
  columnHelper.accessor('exercise.name', {
    id: 'exercise',
    header: 'Exercício',
    enableSorting: false,
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  columnHelper.accessor('workout.name', {
    id: 'workout',
    header: 'Treino',
    enableSorting: false,
  }),
  columnHelper.accessor((row) => row.gym?.name ?? null, {
    id: 'gym',
    header: 'Academia',
    enableSorting: false,
    cell: ({ getValue }) => getValue() ?? '—',
  }),
  columnHelper.accessor('actualSets', {
    id: 'actualSets',
    header: 'Séries',
    cell: ({ getValue }) => getValue() ?? '—',
  }),
  columnHelper.accessor('actualReps', {
    id: 'actualReps',
    header: 'Reps',
    cell: ({ getValue }) => getValue() ?? '—',
  }),
  columnHelper.accessor('actualWeight', {
    id: 'actualWeight',
    header: 'Carga (kg)',
    cell: ({ getValue }) => formatDecimal(getValue()),
  }),
  columnHelper.accessor('rpe', {
    id: 'rpe',
    header: 'RPE',
    enableSorting: false,
    cell: ({ getValue }) => formatDecimal(getValue()),
  }),
  columnHelper.accessor('notes', {
    id: 'notes',
    header: 'Notas',
    enableSorting: false,
    cell: ({ getValue }) => {
      const notes = getValue()
      return notes ? (
        <span className="text-muted-foreground block max-w-60 truncate" title={notes}>
          {notes}
        </span>
      ) : (
        '—'
      )
    },
  }),
])

function formatDecimal(value: string | null) {
  return value === null ? '—' : Number(value).toLocaleString('pt-BR')
}

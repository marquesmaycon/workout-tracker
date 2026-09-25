import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, useRouterState } from '@tanstack/react-router'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { functionalUpdate, useTable } from '@tanstack/react-table'

import { DataTable } from '@/components/data-table/data-table'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { dataTableFeatures } from '@/components/data-table/features'
import { orpc } from '@/orpc/client'

import { exerciseLogPageSizes, exerciseLogSearchSchema } from '../validation/exercise-log.search'
import { exerciseLogColumns } from './exercise-log-columns'

const routeApi = getRouteApi('/(private)/_dashboard/exercise-log/')

export function ExerciseLogTable() {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { data } = useSuspenseQuery(orpc.exerciseLog.list.queryOptions({ input: search }))
  const isNavigating = useRouterState({ select: (state) => state.status === 'pending' })

  const pagination: PaginationState = { pageIndex: search.page - 1, pageSize: search.pageSize }
  const sorting: SortingState = [{ id: search.sort, desc: search.order === 'desc' }]

  const table = useTable({
    features: dataTableFeatures,
    columns: exerciseLogColumns,
    data: data.items,
    getRowId: (row) => row.id,
    rowCount: data.total,
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: false,
    enableSortingRemoval: false,
    state: { pagination, sorting },
    onPaginationChange: (updater) => {
      const next = functionalUpdate(updater, pagination)
      const pageSizeChanged = next.pageSize !== pagination.pageSize

      void navigate({
        search: (prev) => ({
          ...prev,
          page: pageSizeChanged ? 1 : next.pageIndex + 1,
          pageSize: exerciseLogSearchSchema.shape.pageSize.parse(next.pageSize),
        }),
      })
    },
    onSortingChange: (updater) => {
      const next = functionalUpdate(updater, sorting).at(0)

      void navigate({
        search: (prev) => ({
          ...prev,
          page: 1,
          sort: exerciseLogSearchSchema.shape.sort.parse(next?.id),
          order: next?.desc === false ? 'asc' : 'desc',
        }),
      })
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <DataTable table={table} loading={isNavigating} emptyMessage="Nenhum exercício registrado com esses filtros." />
      <DataTablePagination table={table} pageSizes={exerciseLogPageSizes} loading={isNavigating} />
    </div>
  )
}

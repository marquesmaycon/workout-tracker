import type { ReactTable, RowData } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { DataTableFeatures } from './features'

type DataTablePaginationProps<TData extends RowData, TSelected> = {
  table: ReactTable<DataTableFeatures, TData, TSelected>
  pageSizes: ReadonlyArray<number>
  loading?: boolean
}

export function DataTablePagination<TData extends RowData, TSelected>({
  table,
  pageSizes,
  loading = false,
}: DataTablePaginationProps<TData, TSelected>) {
  const { pageIndex, pageSize } = table.atoms.pagination.get()
  const pageCount = Math.max(table.getPageCount(), 1)
  const rowCount = table.getRowCount()
  const pageSizeItems = pageSizes.map((size) => ({ value: size, label: String(size) }))

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
      <p className="text-muted-foreground flex items-center gap-1.5 text-xs" aria-live="polite">
        {rowCount} {rowCount === 1 ? 'registro' : 'registros'}
        {loading && (
          <>
            <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
            <span className="sr-only">Carregando</span>
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Por página</span>
          <Select
            items={pageSizeItems}
            value={pageSize}
            onValueChange={(value) => {
              if (value !== null) table.setPageSize(value)
            }}
          >
            <SelectTrigger size="sm" aria-label="Registros por página">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs">
          Página {pageIndex + 1} de {pageCount}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Primeira página"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.firstPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Página anterior"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Próxima página"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Última página"
            disabled={!table.getCanLastPage()}
            onClick={() => table.lastPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

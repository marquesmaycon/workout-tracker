import type { Header, ReactTable, RowData } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

import type { DataTableFeatures } from './features'

type DataTableProps<TData extends RowData, TSelected> = {
  table: ReactTable<DataTableFeatures, TData, TSelected>
  emptyMessage?: ReactNode
  loading?: boolean
}

export function DataTable<TData extends RowData, TSelected>({
  table,
  emptyMessage = 'Nenhum registro encontrado.',
  loading = false,
}: DataTableProps<TData, TSelected>) {
  const rows = table.getRowModel().rows
  const columnCount = table.getAllLeafColumns().length

  return (
    <div
      aria-busy={loading}
      className={cn('rounded-md border transition-opacity', loading && 'pointer-events-none opacity-60')}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : <DataTableHeader table={table} header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnCount} className="text-muted-foreground h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function DataTableHeader<TData extends RowData, TSelected>({
  table,
  header,
}: {
  table: ReactTable<DataTableFeatures, TData, TSelected>
  header: Header<DataTableFeatures, TData, unknown>
}) {
  if (!header.column.getCanSort()) {
    return <table.FlexRender header={header} />
  }

  const sorted = header.column.getIsSorted()
  const SortIcon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown

  return (
    <Button variant="ghost" size="sm" className="-ml-2" onClick={header.column.getToggleSortingHandler()}>
      <table.FlexRender header={header} />
      <SortIcon aria-hidden="true" className={sorted ? undefined : 'text-muted-foreground'} />
    </Button>
  )
}

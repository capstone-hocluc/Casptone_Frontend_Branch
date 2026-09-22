import type { ReactNode } from 'react'
import {
  type ColumnDef,
  type RowData,
  type TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

// Real semantic <table> markup (not a div/CSS-grid fake table) so browsers
// and screen readers get proper table semantics for free - modeled after
// the tanstack-table v8 usage pattern in the reference CRM dashboard
// (W:\CRM\dashboard-crm/src/components/tailgrids/core/table.tsx). One set
// of .hl-datatable* classes replaces every screen's own hand-rolled table.
interface DataTableProps<T extends RowData> {
  columns: ColumnDef<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  emptyMessage?: ReactNode
  getRowKey: (row: T) => string
  meta?: TableOptions<T>['meta']
}

function DataTable<T extends RowData>({
  columns,
  data,
  onRowClick,
  emptyMessage,
  getRowKey,
  meta,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getRowId: getRowKey,
    getCoreRowModel: getCoreRowModel(),
    meta,
  })
  const columnCount = table.getHeaderGroups()[0]?.headers.length ?? 1

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[15px] text-text-body">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="h-12 border-b border-border-subtle bg-surface-soft px-4.5 py-3 text-left align-middle text-sm leading-5 font-semibold whitespace-nowrap text-text-subtle"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={onRowClick ? 'cursor-pointer hover:bg-surface-hover' : undefined}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-b border-border-subtle px-4.5 py-3.5 align-middle"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {!data.length && (
            <tr>
              <td colSpan={columnCount} className="!py-7 !text-center text-text-subtle">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable

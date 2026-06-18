'use client'

import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
}

export function DataTable<TData>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Cari...',
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchKey && (
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="w-full max-w-sm bg-surface border border-outline-variant px-4 py-2 text-[var(--font-label-technical)] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-surface-card border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-surface-container border-b border-outline-variant">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase tracking-widest"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {{
                          asc: <IconChevronUp size={14} />,
                          desc: <IconChevronDown size={14} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-surface-elevated transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center text-text-muted">
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-outline-variant flex justify-between items-center bg-surface-container-low">
          <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase">
            Menampilkan {table.getRowModel().rows.length} dari {data.length} data
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-10 h-10 border border-outline-variant flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconChevronLeft size={18} />
            </button>
            {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
              .slice(0, 5)
              .map((page) => (
                <button
                  key={page}
                  onClick={() => table.setPageIndex(page - 1)}
                  className={`w-10 h-10 flex items-center justify-center font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] transition-colors ${
                    table.getState().pagination.pageIndex === page - 1
                      ? 'border border-primary bg-primary-container/10 text-primary'
                      : 'border border-outline-variant hover:border-primary hover:text-primary'
                  }`}
                >
                  {page}
                </button>
              ))}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-10 h-10 border border-outline-variant flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

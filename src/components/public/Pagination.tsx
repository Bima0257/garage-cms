'use client'

import Link from 'next/link'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string>
}

export function Pagination({ currentPage, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }
    const qs = params.toString()
    return `${basePath}${qs ? `?${qs}` : ''}`
  }

  const pages: (number | 'ellipsis')[] = []
  const maxVisible = 5

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('ellipsis')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
  }

  return (
    <nav className="flex items-center justify-center gap-1 md:gap-2 mt-8 md:mt-12" aria-label="Pagination">
      {/* Prev */}
      <Link
        href={buildHref(currentPage - 1)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-[var(--font-label-technical)] uppercase transition-colors ${
          currentPage <= 1
            ? 'text-text-muted/30 pointer-events-none'
            : 'text-text-muted hover:text-primary'
        }`}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
      >
        <IconChevronLeft size={16} />
        <span className="hidden sm:inline">Sebelumnya</span>
      </Link>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="px-2 py-2 text-text-muted text-sm select-none">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              className={`w-9 h-9 flex items-center justify-center text-sm font-[var(--font-label-technical)] transition-colors ${
                page === currentPage
                  ? 'bg-primary text-on-primary font-bold'
                  : 'text-text-muted hover:text-primary hover:bg-surface-elevated'
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      <Link
        href={buildHref(currentPage + 1)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-[var(--font-label-technical)] uppercase transition-colors ${
          currentPage >= totalPages
            ? 'text-text-muted/30 pointer-events-none'
            : 'text-text-muted hover:text-primary'
        }`}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
      >
        <span className="hidden sm:inline">Selanjutnya</span>
        <IconChevronRight size={16} />
      </Link>
    </nav>
  )
}

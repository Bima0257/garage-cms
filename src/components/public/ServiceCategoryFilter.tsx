'use client'

import Link from 'next/link'
import { useState } from 'react'
import { IconChevronDown, IconChevronUp, IconTool } from '@tabler/icons-react'
import type { ServiceCategory } from '@/types/database.types'

interface ServiceCategoryFilterProps {
  categories: ServiceCategory[]
  selectedCategory?: string
}

export function ServiceCategoryFilter({ categories, selectedCategory }: ServiceCategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCatData = categories.find(c => c.id.toString() === selectedCategory)

  return (
    <>
      {/* Mobile: Dropdown */}
      <div className="lg:hidden w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-surface border border-white/10"
        >
          <div className="flex items-center gap-3">
            <IconTool size={20} className="text-primary" />
            <span className="font-[var(--font-label-technical)] text-sm uppercase">
              {selectedCatData ? selectedCatData.name : 'Semua Layanan'}
            </span>
          </div>
          {isOpen ? (
            <IconChevronUp size={20} className="text-on-surface-variant" />
          ) : (
            <IconChevronDown size={20} className="text-on-surface-variant" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="bg-surface border-x border-b border-white/10">
            <Link
              href="/layanan"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 font-[var(--font-body-md)] border-b border-white/5 last:border-b-0 transition-colors ${
                !selectedCategory
                  ? 'text-primary font-semibold bg-primary/5'
                  : 'text-text-secondary hover:text-primary hover:bg-white/5'
              }`}
            >
              Semua Layanan
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/layanan?category=${category.id}`}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 font-[var(--font-body-md)] border-b border-white/5 last:border-b-0 transition-colors ${
                  selectedCategory === category.id.toString()
                    ? 'text-primary font-semibold bg-primary/5'
                    : 'text-text-secondary hover:text-primary hover:bg-white/5'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Sidebar List */}
      <div className="hidden lg:block">
        <h3 className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted mb-6 uppercase tracking-widest">
          KATEGORI
        </h3>
        <ul className="space-y-4">
          <li>
            <Link
              href="/layanan"
              className={`group flex items-center justify-between w-full text-left font-[var(--font-body-md)] ${!selectedCategory ? 'text-primary font-semibold' : 'text-text-secondary hover:text-primary'} transition-colors`}
            >
              <span>Semua Layanan</span>
              <span className={`w-4 h-[1px] ${!selectedCategory ? 'bg-primary' : ''} group-hover:w-8 transition-all`}></span>
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/layanan?category=${category.id}`}
                className={`group flex items-center justify-between w-full text-left font-[var(--font-body-md)] ${selectedCategory === category.id.toString() ? 'text-primary font-semibold' : 'text-text-secondary hover:text-primary'} transition-colors`}
              >
                <span>{category.name}</span>
                <span className={`w-4 h-[1px] ${selectedCategory === category.name ? 'bg-primary' : ''} group-hover:w-8 transition-all`}></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

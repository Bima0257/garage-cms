'use client'

import Link from 'next/link'
import { useState } from 'react'
import { IconChevronDown, IconChevronUp, IconPackages } from '@tabler/icons-react'
import type { ProductCategory } from '@/types/database.types'

interface CategoryFilterProps {
  categories: ProductCategory[]
  selectedCategory?: string
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCatData = categories.find(c => c.slug === selectedCategory)

  return (
    <>
      {/* Mobile: Dropdown */}
      <div className="lg:hidden w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-surface border border-white/10"
        >
          <div className="flex items-center gap-3">
            <IconPackages size={20} className="text-primary" />
            <span className="font-[var(--font-label-technical)] text-sm uppercase">
              {selectedCatData ? selectedCatData.name : 'Semua Produk'}
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
              href="/produk"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 font-[var(--font-body-md)] border-b border-white/5 last:border-b-0 transition-colors ${
                !selectedCategory
                  ? 'text-primary font-semibold bg-primary/5'
                  : 'text-text-secondary hover:text-primary hover:bg-white/5'
              }`}
            >
              Semua Produk
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/produk?category=${category.slug}`}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 font-[var(--font-body-md)] border-b border-white/5 last:border-b-0 transition-colors ${
                  selectedCategory === category.slug
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
              href="/produk"
              className={`group flex items-center justify-between w-full text-left font-[var(--font-body-md)] ${!selectedCategory ? 'text-primary font-semibold' : 'text-text-secondary hover:text-primary'} transition-colors`}
            >
              <span>Semua Produk</span>
              <span className={`w-4 h-[1px] ${!selectedCategory ? 'bg-primary' : ''} group-hover:w-8 transition-all`}></span>
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/produk?category=${category.slug}`}
                className={`group flex items-center justify-between w-full text-left font-[var(--font-body-md)] ${selectedCategory === category.slug ? 'text-primary font-semibold' : 'text-text-secondary hover:text-primary'} transition-colors`}
              >
                <span>{category.name}</span>
                <span className={`w-4 h-[1px] ${selectedCategory === category.slug ? 'bg-primary' : ''} group-hover:w-8 transition-all`}></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

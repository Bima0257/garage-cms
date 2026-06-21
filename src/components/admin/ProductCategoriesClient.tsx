'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconPlus, IconPackage } from '@tabler/icons-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, FormDialog, ActionButtons } from '@/components/admin'
import { productCategorySchema } from '@/lib/validations/product-category'
import type { ProductCategory } from '@/types/database.types'

interface ProductCategoriesClientProps {
  initialCategories: ProductCategory[]
  productCountMap: Record<number, number>
}

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function ProductCategoriesClient({ initialCategories, productCountMap }: ProductCategoriesClientProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const columns: ColumnDef<ProductCategory, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Nama',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-text-primary">{row.original.name}</p>
          <p className="text-xs text-text-muted">/{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Deskripsi',
      cell: ({ row }) => (
        <p className="text-sm text-text-secondary line-clamp-2 max-w-md">
          {row.original.description || '-'}
        </p>
      ),
    },
    {
      accessorKey: 'sort_order',
      header: 'Urutan',
      cell: ({ row }) => (
        <span className="font-[var(--font-label-technical)] text-text-muted">
          {row.original.sort_order ?? 0}
        </span>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs uppercase font-bold ${
          row.original.is_active
            ? 'bg-whatsapp-green/20 text-whatsapp-green'
            : 'bg-surface-container text-text-muted'
        }`}>
          {row.original.is_active ? 'Aktif' : 'Tidak Aktif'}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionButtons
          id={row.original.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteDisabled={(productCountMap[row.original.id] || 0) > 0}
        />
      ),
    },
  ]

  const fields = [
    { name: 'name', label: 'Nama Kategori', type: 'text' as const, required: true },
    { name: 'slug', label: 'Slug (otomatis jika kosong)', type: 'text' as const, required: false },
    { name: 'description', label: 'Deskripsi', type: 'textarea' as const },
    { name: 'sort_order', label: 'Urutan', type: 'number' as const },
    { name: 'is_active', label: 'Aktif', type: 'checkbox' as const },
  ]

  async function handleSubmit(data: Record<string, unknown>) {
    setIsSubmitting(true)
    try {
      const url = editingCategory
        ? `/api/product-categories/${editingCategory.id}`
        : '/api/product-categories'
      const method = editingCategory ? 'PUT' : 'POST'

      // Auto-generate slug from name if not provided
      if (!data.slug && data.name) {
        data.slug = generateSlug(data.name as string)
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save')
      }

      // Fetch fresh data after successful create/update
      const refreshResponse = await fetch('/api/product-categories')
      if (refreshResponse.ok) {
        const freshData = await refreshResponse.json()
        setCategories(freshData)
      }

      router.refresh()
      setEditingCategory(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(id: number) {
    const category = categories.find((c) => c.id === id)
    if (category) {
      setEditingCategory(category)
      setIsDialogOpen(true)
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch(`/api/product-categories/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete')
      }
      router.refresh()
      setCategories(categories.filter((c) => c.id !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete category')
    }
  }

  function handleAddNew() {
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
            Kategori Produk
          </h2>
          <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
            <IconPackage size={16} />
            Kelola kategori produk
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary text-on-primary px-6 py-3 font-bold uppercase flex items-center gap-2 hover:bg-primary-container transition-colors"
        >
          <IconPlus size={18} />
          Tambah Kategori
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Cari kategori..."
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingCategory(null)
        }}
        onSubmit={handleSubmit}
        title={editingCategory ? 'Ubah Kategori' : 'Tambah Kategori'}
        schema={productCategorySchema}
        fields={fields}
        defaultValues={editingCategory || {
          sort_order: 0,
          is_active: true,
        }}
        loading={isSubmitting}
      />
    </div>
  )
}

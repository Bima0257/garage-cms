'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IconPlus, IconCategory } from '@tabler/icons-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, FormDialog, ActionButtons } from '@/components/admin'
import { serviceCategorySchema } from '@/lib/validations/service-category'
import type { ServiceCategory } from '@/types/database.types'

interface ServiceCategoriesClientProps {
  initialCategories: ServiceCategory[]
}

export function ServiceCategoriesClient({ initialCategories }: ServiceCategoriesClientProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const columns: ColumnDef<ServiceCategory, unknown>[] = [
    {
      accessorKey: 'image',
      header: 'Gambar',
      cell: ({ row }) => (
        <div className="w-16 h-12 bg-surface border border-outline-variant overflow-hidden">
          {row.original.image ? (
            <Image
              src={row.original.image}
              alt={row.original.name}
              width={64}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
              No img
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nama',
      cell: ({ row }) => (
        <p className="font-semibold text-text-primary">{row.original.name}</p>
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
      cell: ({ row }) => {
        const isActive = row.original.is_active
        return (
          <span className={'px-2 py-1 text-xs uppercase font-bold ' + (isActive ? 'bg-whatsapp-green/20 text-whatsapp-green' : 'bg-surface-container text-text-muted')}>
            {isActive ? 'Aktif' : 'Tidak Aktif'}
          </span>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionButtons
          id={row.original.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ]

  const fields = [
    { name: 'name', label: 'Nama Kategori', type: 'text' as const, required: true },
    { name: 'description', label: 'Deskripsi', type: 'textarea' as const },
    { name: 'image', label: 'Gambar', type: 'image' as const },
    { name: 'sort_order', label: 'Urutan', type: 'number' as const },
    { name: 'is_active', label: 'Aktif', type: 'checkbox' as const },
  ]

  async function handleSubmit(data: Record<string, unknown>) {
    setIsSubmitting(true)
    try {
      const url = editingCategory
        ? '/api/service-categories/' + editingCategory.id
        : '/api/service-categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save')
      }

      const refreshResponse = await fetch('/api/service-categories')
      if (refreshResponse.ok) {
        const freshData = await refreshResponse.json()
        setCategories(freshData)
      }

      router.refresh()
      setEditingCategory(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menyimpan')
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
      const response = await fetch('/api/service-categories/' + id, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete')
      }
      router.refresh()
      setCategories(categories.filter((c) => c.id !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menghapus kategori')
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
            Kategori Layanan
          </h2>
          <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
            <IconCategory size={16} />
            Kelola kategori layanan
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
        schema={serviceCategorySchema}
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

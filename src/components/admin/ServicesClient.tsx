'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconPlus } from '@tabler/icons-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, FormDialog, ActionButtons } from '@/components/admin'
import { serviceSchema } from '@/lib/validations/service'
import type { Service, ServiceCategory } from '@/types/database.types'

interface ServicesClientProps {
  initialServices: Service[]
  categories: ServiceCategory[]
}

export function ServicesClient({ initialServices, categories }: ServicesClientProps) {
  const router = useRouter()
  const [services, setServices] = useState(initialServices)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const columns: ColumnDef<Service, unknown>[] = [
    {
      accessorKey: 'image',
      header: 'Gambar',
      cell: ({ row }) => (
        <div className="w-16 h-12 bg-surface border border-outline-variant overflow-hidden">
          {row.original.image ? (
            <img
              src={row.original.image}
              alt={row.original.name}
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
      header: 'Nama Layanan',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-text-primary">{row.original.name}</p>
          <p className="text-xs text-text-muted">{row.original.duration || 'Durasi bervariasi'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'price_from',
      header: 'Harga Mulai',
      cell: ({ row }) => (
        <span className="font-[var(--font-label-technical)]">
          Rp {row.original.price_from.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      accessorKey: 'is_featured',
      header: 'Unggulan',
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs uppercase font-bold ${
          row.original.is_featured
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container text-text-muted'
        }`}>
          {row.original.is_featured ? 'Ya' : 'Tidak'}
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
        />
      ),
    },
  ]

  const fields = [
    { name: 'name', label: 'Nama Layanan', type: 'text' as const, required: true },
    { name: 'description', label: 'Deskripsi', type: 'textarea' as const },
    { name: 'image', label: 'Gambar', type: 'image' as const },
    { name: 'price_from', label: 'Harga Mulai (IDR)', type: 'number' as const, required: true },
    { name: 'duration', label: 'Durasi (cth: 4 Jam)', type: 'text' as const },
    {
      name: 'category_id',
      label: 'Kategori',
      type: 'select' as const,
      options: categories.map((c) => ({ value: c.id, label: c.name })),
    },
    { name: 'is_featured', label: 'Unggulan', type: 'checkbox' as const },
    { name: 'is_active', label: 'Aktif', type: 'checkbox' as const },
  ]

  async function handleSubmit(data: Record<string, unknown>) {
    setIsSubmitting(true)
    try {
      const url = editingService
        ? `/api/services/${editingService.id}`
        : '/api/services'
      const method = editingService ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Gagal menyimpan')

      router.refresh()
      setEditingService(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(id: number) {
    const service = services.find((s) => s.id === id)
    if (service) {
      setEditingService(service)
      setIsDialogOpen(true)
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Gagal menghapus')
      router.refresh()
      setServices(services.filter((s) => s.id !== id))
    } catch {
      alert('Gagal menghapus layanan')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
            Services
          </h2>
          <p className="text-text-muted text-sm mt-1">
            Kelola layanan bengkel
          </p>
        </div>
        <button
          onClick={() => {
            setEditingService(null)
            setIsDialogOpen(true)
          }}
          className="bg-primary text-on-primary px-6 py-3 font-bold uppercase flex items-center gap-2 hover:bg-primary-container transition-colors"
        >
          <IconPlus size={18} />
          Tambah Layanan
        </button>
      </div>

      <DataTable
        columns={columns}
        data={services}
        searchKey="name"
        searchPlaceholder="Cari layanan..."
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingService(null)
        }}
        onSubmit={handleSubmit}
        title={editingService ? 'Ubah Layanan' : 'Tambah Layanan'}
        schema={serviceSchema}
        fields={fields}
        defaultValues={editingService || {
          price_from: 0,
          is_featured: false,
          is_active: true,
        }}
        loading={isSubmitting}
      />
    </div>
  )
}

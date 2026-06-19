'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IconPlus, IconBell } from '@tabler/icons-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, FormDialog, ActionButtons } from '@/components/admin'
import { modalPromotionSchema } from '@/lib/validations/modal-promotion'
import type { ModalPromotion } from '@/types/database.types'
import { safeImageSrc } from '@/lib/utils'

interface ModalPromotionsClientProps {
  initialPromotions: ModalPromotion[]
}

export function ModalPromotionsClient({ initialPromotions }: ModalPromotionsClientProps) {
  const router = useRouter()
  const [promotions, setPromotions] = useState(initialPromotions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<ModalPromotion | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const now = new Date()
  const isActivePromotion = (promo: ModalPromotion) => {
    if (!promo.is_active) return false
    const start = new Date(promo.start_date)
    const end = new Date(promo.end_date)
    return now >= start && now <= end
  }

  const columns: ColumnDef<ModalPromotion, unknown>[] = [
    {
      accessorKey: 'image',
      header: 'Gambar',
      cell: ({ row }) => (
        <div className="w-20 h-12 bg-surface border border-outline-variant overflow-hidden">
          <Image
            src={safeImageSrc(row.original.image)}
            alt={row.original.title}
            width={80}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Judul',
      cell: ({ row }) => (
        <p className="font-semibold text-text-primary">{row.original.title}</p>
      ),
    },
    {
      accessorKey: 'start_date',
      header: 'Mulai',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">
          {new Date(row.original.start_date).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </span>
      ),
    },
    {
      accessorKey: 'end_date',
      header: 'Selesai',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">
          {new Date(row.original.end_date).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const active = isActivePromotion(row.original)
        return (
          <span className={'px-2 py-1 text-xs uppercase font-bold ' + (active ? 'bg-whatsapp-green/20 text-whatsapp-green' : 'bg-surface-container text-text-muted')}>
            {active ? 'Aktif' : 'Tidak Aktif'}
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
    { name: 'title', label: 'Judul', type: 'text' as const, required: true },
    { name: 'description', label: 'Deskripsi', type: 'textarea' as const },
    { name: 'image', label: 'Gambar', type: 'image' as const },
    { name: 'button_text', label: 'Teks Tombol', type: 'text' as const },
    { name: 'button_url', label: 'URL Tombol', type: 'url' as const },
    { name: 'start_date', label: 'Mulai', type: 'text' as const, required: true },
    { name: 'end_date', label: 'Selesai', type: 'text' as const, required: true },
    { name: 'is_active', label: 'Aktif', type: 'checkbox' as const },
  ]

  async function handleSubmit(data: Record<string, unknown>) {
    setIsSubmitting(true)
    try {
      const url = editingPromotion
        ? '/api/modal-promotions/' + editingPromotion.id
        : '/api/modal-promotions'
      const method = editingPromotion ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save')
      }

      const refreshResponse = await fetch('/api/modal-promotions')
      if (refreshResponse.ok) {
        const freshData = await refreshResponse.json()
        setPromotions(freshData)
      }

      router.refresh()
      setEditingPromotion(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menyimpan')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(id: number) {
    const promotion = promotions.find((p) => p.id === id)
    if (promotion) {
      setEditingPromotion(promotion)
      setIsDialogOpen(true)
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch('/api/modal-promotions/' + id, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete')
      }
      router.refresh()
      setPromotions(promotions.filter((p) => p.id !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menghapus promosi')
    }
  }

  function handleAddNew() {
    setEditingPromotion(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
            Promotions
          </h2>
          <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
            <IconBell size={16} />
            Kelola promosi popup
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary text-on-primary px-6 py-3 font-bold uppercase flex items-center gap-2 hover:bg-primary-container transition-colors"
        >
          <IconPlus size={18} />
          Tambah Promosi
        </button>
      </div>

      <DataTable
        columns={columns}
        data={promotions}
        searchKey="title"
        searchPlaceholder="Cari promosi..."
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingPromotion(null)
        }}
        onSubmit={handleSubmit}
        title={editingPromotion ? 'Ubah Promosi' : 'Tambah Promosi'}
        schema={modalPromotionSchema}
        fields={fields}
        defaultValues={editingPromotion || {
          is_active: true,
        }}
        loading={isSubmitting}
      />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconPlus, IconShare } from '@tabler/icons-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, FormDialog, ActionButtons } from '@/components/admin'
import { socialMediaSchema } from '@/lib/validations/social-media'
import type { SocialMedia } from '@/types/database.types'

interface SocialMediaClientProps {
  initialSocialMedia: SocialMedia[]
}

export function SocialMediaClient({ initialSocialMedia }: SocialMediaClientProps) {
  const router = useRouter()
  const [items, setItems] = useState(initialSocialMedia)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SocialMedia | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const columns: ColumnDef<SocialMedia, unknown>[] = [
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }) => (
        <p className="font-semibold text-text-primary">{row.original.platform}</p>
      ),
    },
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }) => (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline line-clamp-1 max-w-xs block"
        >
          {row.original.url}
        </a>
      ),
    },
    {
      accessorKey: 'icon',
      header: 'Ikon',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-text-muted">
          {row.original.icon || '-'}
        </span>
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
        <span className={'px-2 py-1 text-xs uppercase font-bold ' + (row.original.is_active ? 'bg-whatsapp-green/20 text-whatsapp-green' : 'bg-surface-container text-text-muted')}>
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
        />
      ),
    },
  ]

  const fields = [
    { name: 'platform', label: 'Platform', type: 'text' as const, required: true },
    { name: 'url', label: 'URL', type: 'url' as const, required: true },
    { name: 'icon', label: 'Kelas Ikon', type: 'text' as const },
    { name: 'sort_order', label: 'Urutan', type: 'number' as const },
    { name: 'is_active', label: 'Aktif', type: 'checkbox' as const },
  ]

  async function handleSubmit(data: Record<string, unknown>) {
    setIsSubmitting(true)
    try {
      const url = editingItem
        ? '/api/social-media/' + editingItem.id
        : '/api/social-media'
      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save')
      }

      const refreshResponse = await fetch('/api/social-media')
      if (refreshResponse.ok) {
        const freshData = await refreshResponse.json()
        setItems(freshData)
      }

      router.refresh()
      setEditingItem(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(id: number) {
    const item = items.find((i) => i.id === id)
    if (item) {
      setEditingItem(item)
      setIsDialogOpen(true)
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch('/api/social-media/' + id, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete')
      }
      router.refresh()
      setItems(items.filter((i) => i.id !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete')
    }
  }

  function handleAddNew() {
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
            Social Media
          </h2>
          <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
            <IconShare size={16} />
            Kelola tautan media sosial
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary text-on-primary px-6 py-3 font-bold uppercase flex items-center gap-2 hover:bg-primary-container transition-colors"
        >
          <IconPlus size={18} />
          Tambah Sosial Media
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        searchKey="platform"
        searchPlaceholder="Cari platform..."
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingItem(null)
        }}
        onSubmit={handleSubmit}
        title={editingItem ? 'Ubah Sosial Media' : 'Tambah Sosial Media'}
        schema={socialMediaSchema}
        fields={fields}
        defaultValues={editingItem || {
          sort_order: 0,
          is_active: true,
        }}
        loading={isSubmitting}
      />
    </div>
  )
}

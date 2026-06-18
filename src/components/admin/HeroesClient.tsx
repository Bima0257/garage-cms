'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IconPlus, IconPhoto } from '@tabler/icons-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, FormDialog, ActionButtons } from '@/components/admin'
import { heroSchema } from '@/lib/validations/hero'
import type { Hero } from '@/types/database.types'
import { safeImageSrc } from '@/lib/utils'

interface HeroesClientProps {
  initialHeroes: Hero[]
}

export function HeroesClient({ initialHeroes }: HeroesClientProps) {
  const router = useRouter()
  const [heroes, setHeroes] = useState(initialHeroes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHero, setEditingHero] = useState<Hero | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const columns: ColumnDef<Hero, unknown>[] = [
    {
      accessorKey: 'image',
      header: 'Gambar',
      cell: ({ row }) => (
        <div className="w-20 h-12 bg-surface border border-outline-variant overflow-hidden">
          {safeImageSrc(row.original.image) ? (
            <Image
              src={safeImageSrc(row.original.image)!}
              alt={row.original.title}
              width={80}
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
      accessorKey: 'title',
      header: 'Judul',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-text-primary">{row.original.title}</p>
          {row.original.subtitle && (
            <p className="text-xs text-text-muted">{row.original.subtitle}</p>
          )}
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
    { name: 'title', label: 'Judul', type: 'text' as const, required: true },
    { name: 'subtitle', label: 'Subjudul', type: 'text' as const },
    { name: 'description', label: 'Deskripsi', type: 'textarea' as const },
    { name: 'image', label: 'Gambar Latar', type: 'image' as const },
    { name: 'button_text', label: 'Teks Tombol', type: 'text' as const },
    { name: 'button_url', label: 'URL Tombol', type: 'url' as const },
    { name: 'sort_order', label: 'Urutan', type: 'number' as const },
    { name: 'is_active', label: 'Aktif', type: 'checkbox' as const },
  ]

  async function handleSubmit(data: Record<string, unknown>) {
    setIsSubmitting(true)
    try {
      const url = editingHero
        ? '/api/heroes/' + editingHero.id
        : '/api/heroes'
      const method = editingHero ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save')
      }

      const refreshResponse = await fetch('/api/heroes')
      if (refreshResponse.ok) {
        const freshData = await refreshResponse.json()
        setHeroes(freshData)
      }

      router.refresh()
      setEditingHero(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menyimpan')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(id: number) {
    const hero = heroes.find((h) => h.id === id)
    if (hero) {
      setEditingHero(hero)
      setIsDialogOpen(true)
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch('/api/heroes/' + id, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete')
      }
      router.refresh()
      setHeroes(heroes.filter((h) => h.id !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menghapus hero')
    }
  }

  function handleAddNew() {
    setEditingHero(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
            Hero Slides
          </h2>
          <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
            <IconPhoto size={16} />
            Kelola banner hero halaman utama
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary text-on-primary px-6 py-3 font-bold uppercase flex items-center gap-2 hover:bg-primary-container transition-colors"
        >
          <IconPlus size={18} />
          Tambah Hero
        </button>
      </div>

      <DataTable
        columns={columns}
        data={heroes}
        searchKey="title"
        searchPlaceholder="Cari hero..."
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingHero(null)
        }}
        onSubmit={handleSubmit}
        title={editingHero ? 'Ubah Hero' : 'Tambah Hero'}
        schema={heroSchema}
        fields={fields}
        defaultValues={editingHero || {
          sort_order: 0,
          is_active: true,
        }}
        loading={isSubmitting}
      />
    </div>
  )
}

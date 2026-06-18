'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IconPlus } from '@tabler/icons-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, FormDialog, ActionButtons } from '@/components/admin'
import { productSchema } from '@/lib/validations/product'
import type { Product, ProductCategory } from '@/types/database.types'

interface ProductsClientProps {
  initialProducts: Product[]
  categories: ProductCategory[]
}

export function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const columns: ColumnDef<Product, unknown>[] = [
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
        <div>
          <p className="font-semibold text-text-primary">{row.original.name}</p>
          <p className="text-xs text-text-muted">/{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Harga',
      cell: ({ row }) => (
        <span className="font-[var(--font-label-technical)]">
          Rp {row.original.price.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      accessorKey: 'stock_status',
      header: 'Stok',
      cell: ({ row }) => {
        const status = {
          in_stock: { label: 'Tersedia', class: 'text-whatsapp-green' },
          limited: { label: 'Terbatas', class: 'text-primary' },
          out_of_stock: { label: 'Habis', class: 'text-accent-red' },
        }[row.original.stock_status as string]
        return (
          <span className={`font-[var(--font-label-technical)] text-xs uppercase ${status?.class}`}>
            {status?.label}
          </span>
        )
      },
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
    { name: 'name', label: 'Nama Produk', type: 'text' as const, required: true },
    { name: 'slug', label: 'Slug', type: 'text' as const, required: true },
    { name: 'short_description', label: 'Deskripsi Singkat', type: 'textarea' as const },
    { name: 'description', label: 'Deskripsi', type: 'textarea' as const },
    { name: 'image', label: 'Gambar', type: 'image' as const },
    { name: 'price', label: 'Harga (IDR)', type: 'number' as const, required: true },
    { name: 'discount_price', label: 'Harga Diskon (IDR)', type: 'number' as const },
    {
      name: 'category_id',
      label: 'Kategori',
      type: 'select' as const,
      options: categories.map((c) => ({ value: c.id, label: c.name })),
    },
    {
      name: 'stock_status',
      label: 'Status Stok',
      type: 'select' as const,
      options: [
        { value: 'in_stock', label: 'Tersedia' },
        { value: 'limited', label: 'Terbatas' },
        { value: 'out_of_stock', label: 'Habis' },
      ],
    },
    { name: 'is_featured', label: 'Unggulan', type: 'checkbox' as const },
    { name: 'is_active', label: 'Aktif', type: 'checkbox' as const },
  ]

  async function handleSubmit(data: Record<string, unknown>) {
    setIsSubmitting(true)
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Gagal menyimpan')

      router.refresh()
      setProducts(await response.json())
      setEditingProduct(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(id: number) {
    const product = products.find((p) => p.id === id)
    if (product) {
      setEditingProduct(product)
      setIsDialogOpen(true)
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Gagal menghapus')
      router.refresh()
      setProducts(products.filter((p) => p.id !== id))
    } catch {
      alert('Gagal menghapus produk')
    }
  }

  function handleAddNew() {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
            Products
          </h2>
          <p className="text-text-muted text-sm mt-1">
            Kelola inventaris produk
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary text-on-primary px-6 py-3 font-bold uppercase flex items-center gap-2 hover:bg-primary-container transition-colors"
        >
          <IconPlus size={18} />
          Tambah Produk
        </button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder="Cari produk..."
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingProduct(null)
        }}
        onSubmit={handleSubmit}
        title={editingProduct ? 'Ubah Produk' : 'Tambah Produk'}
        schema={productSchema}
        fields={fields}
        defaultValues={editingProduct || {
          price: 0,
          stock_status: 'in_stock',
          is_featured: false,
          is_active: true,
        }}
        loading={isSubmitting}
      />
    </div>
  )
}

import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { IconSearch, IconPackage, IconTool, IconPhoto, IconBell, IconArticle, IconWorldWww, IconCategory } from '@tabler/icons-react'

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

const sections: {
  key: string
  label: string
  icon: React.ReactNode
  href: string
  searchFields: string[]
  table: string
}[] = [
  { key: 'products', label: 'Produk', icon: <IconPackage size={20} />, href: '/admin/produk', searchFields: ['name', 'short_description'], table: 'products' },
  { key: 'services', label: 'Layanan', icon: <IconTool size={20} />, href: '/admin/layanan', searchFields: ['name', 'description'], table: 'services' },
  { key: 'heroes', label: 'Hero', icon: <IconPhoto size={20} />, href: '/admin/hero', searchFields: ['title', 'subtitle', 'description'], table: 'heroes' },
  { key: 'product_categories', label: 'Kategori Produk', icon: <IconCategory size={20} />, href: '/admin/kategori', searchFields: ['name', 'description'], table: 'product_categories' },
  { key: 'service_categories', label: 'Kategori Layanan', icon: <IconCategory size={20} />, href: '/admin/kategori-layanan', searchFields: ['name', 'description'], table: 'service_categories' },
  { key: 'promotions', label: 'Promo', icon: <IconBell size={20} />, href: '/admin/promo', searchFields: ['title', 'description'], table: 'modal_promotions' },
  { key: 'messages', label: 'Pesan', icon: <IconArticle size={20} />, href: '/admin/pesan', searchFields: ['name', 'email', 'subject', 'message'], table: 'contact_messages' },
  { key: 'social_media', label: 'Sosial Media', icon: <IconWorldWww size={20} />, href: '/admin/social-media', searchFields: ['platform'], table: 'social_media' },
]

export default async function AdminSearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams

  if (!q || !q.trim()) {
    return <EmptyState />
  }

  const keyword = q.trim()
  const searchPattern = `%${keyword}%`
  const adminClient = createAdminClient()

  const queries = sections.map(async (section) => {
    const orConditions = section.searchFields
      .map((field) => `${field}.ilike.${searchPattern}`)
      .join(',')

    const { data } = await adminClient
      .from(section.table as never)
      .select(section.table === 'contact_messages' ? 'id, name, subject' : 'id, name, title')
      .or(orConditions)
      .limit(8) as { data: { id: number; name?: string; title?: string; subject?: string }[] | null }

    return { ...section, results: data ?? [] }
  })

  const allSections = await Promise.all(queries)
  const sectionsWithResults = allSections.filter((s) => s.results.length > 0)
  const totalResults = sectionsWithResults.reduce((sum, s) => sum + s.results.length, 0)

  if (totalResults === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <IconSearch size={24} className="text-text-muted" />
          <div>
            <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
              Hasil Pencarian
            </h2>
            <p className="text-text-muted text-sm">
              Tidak ada hasil untuk &ldquo;{keyword}&rdquo;
            </p>
          </div>
        </div>
        <div className="text-center py-20 text-text-muted">
          <IconSearch size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">Tidak ditemukan</p>
          <p className="text-sm">Coba gunakan kata kunci lain</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <IconSearch size={24} className="text-primary" />
        <div>
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
            Hasil Pencarian
          </h2>
          <p className="text-text-muted text-sm">
            {totalResults} hasil untuk &ldquo;<span className="text-primary">{keyword}</span>&rdquo;
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-8">
        {sectionsWithResults.map((section) => (
          <section key={section.key}>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="text-primary">{section.icon}</span>
                <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-md)] uppercase">
                  {section.label}
                </h3>
                <span className="text-text-muted text-sm">({section.results.length})</span>
              </div>
              <Link
                href={section.href}
                className="text-primary text-sm hover:underline font-[var(--font-label-technical)] uppercase"
              >
                Lihat Semua →
              </Link>
            </div>

            {/* Results List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {section.results.map((item) => (
                <Link
                  key={item.id}
                  href={section.href}
                  className="flex items-center gap-3 px-4 py-3 bg-surface-card border border-outline-variant hover:border-primary transition-colors group"
                >
                  <span className="text-text-muted group-hover:text-primary transition-colors">
                    {section.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-[var(--font-body-md)] text-text-primary truncate group-hover:text-primary transition-colors">
                      {'name' in item ? item.name : item.title}
                    </p>
                    {'subject' in item && item.subject && (
                      <p className="text-xs text-text-muted truncate">{item.subject}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <IconSearch size={24} className="text-text-muted" />
        <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
          Pencarian
        </h2>
      </div>
      <div className="text-center py-20 text-text-muted">
        <IconSearch size={48} className="mx-auto mb-4 opacity-30" />
        <p className="text-lg mb-2">Cari data di seluruh admin</p>
        <p className="text-sm">Masukkan kata kunci di search bar header untuk memulai</p>
      </div>
    </div>
  )
}

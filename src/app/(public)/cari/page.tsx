import { createClient } from '@/lib/supabase/server'
import { ProductCard, ServiceCard } from '@/components/public'
import type { Product, Service, Settings } from '@/types/database.types'
import { IconSearch } from '@tabler/icons-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single() as { data: Settings | null }

  const whatsapp = settings?.whatsapp ?? undefined

  if (!q || !q.trim()) {
    return (
      <div className="pt-32 md:pt-36 pb-20 md:pb-[var(--spacing-margin-desktop)]">
        <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
          <div className="text-center py-20">
            <IconSearch size={48} className="mx-auto mb-4 text-text-muted" />
            <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] mb-2 uppercase">Cari Produk & Layanan</h2>
            <p className="text-text-secondary">Masukkan kata kunci untuk mencari produk atau layanan</p>
          </div>
        </div>
      </div>
    )
  }

  const keyword = q.trim()
  const searchPattern = `%${keyword}%`

  const [productsResult, servicesResult] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.${searchPattern},short_description.ilike.${searchPattern}`)
      .limit(12),
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`)
      .limit(12),
  ])

  const products = (productsResult.data as Product[] | null) ?? []
  const services = (servicesResult.data as Service[] | null) ?? []
  const totalResults = products.length + services.length

  return (
    <div className="pt-32 md:pt-36 pb-20 md:pb-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] md:text-[var(--font-size-headline-xl)] uppercase mb-2">
            Hasil Pencarian
          </h1>
          <p className="text-text-secondary">
            Menampilkan {totalResults} hasil untuk &ldquo;<span className="text-primary">{keyword}</span>&rdquo;
          </p>
        </div>

        {totalResults === 0 ? (
          <div className="text-center py-20">
            <IconSearch size={48} className="mx-auto mb-4 text-text-muted opacity-50" />
            <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] mb-2 uppercase">Tidak Ditemukan</h2>
            <p className="text-text-secondary mb-6">Tidak ada produk atau layanan yang cocok dengan pencarian Anda</p>
            <Link
              href="/"
              className="inline-block bg-primary text-on-primary px-8 py-3 font-bold uppercase tracking-widest hover:bg-primary-container transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <>
            {/* Products */}
            {products.length > 0 && (
              <section className="mb-12 md:mb-16">
                <h2 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-lg)] uppercase mb-6">
                  Produk <span className="text-primary">({products.length})</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-[var(--spacing-gutter)]">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} whatsapp={whatsapp} />
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            {services.length > 0 && (
              <section>
                <h2 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-lg)] uppercase mb-6">
                  Layanan <span className="text-primary">({services.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[var(--spacing-gutter)]">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} whatsapp={whatsapp} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

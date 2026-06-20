import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard, CategoryFilter, Pagination } from '@/components/public'
import type { ProductCategory, Product } from '@/types/database.types'

const ITEMS_PER_PAGE = 12

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const selectedCategory = params.category
  const currentPage = Math.max(1, parseInt(params.page || '1'))

  // Fetch categories
  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: ProductCategory[] | null }

  // Resolve category slug to id
  let categoryId: number | null = null
  if (selectedCategory) {
    const { data: cat } = await supabase
      .from('product_categories')
      .select('id')
      .eq('slug', selectedCategory)
      .single() as { data: { id: number } | null }
    categoryId = cat?.id ?? null
  }

  // Count total items (for pagination)
  let countQuery = supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  let dataQuery = supabase
    .from('products')
    .select('*, product_categories(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (categoryId) {
    countQuery = countQuery.eq('category_id', categoryId)
    dataQuery = dataQuery.eq('category_id', categoryId)
  }

  const [{ count: totalItems }, { data: products }] = await Promise.all([
    countQuery,
    dataQuery.range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1),
  ]) as [{ count: number | null }, { data: Product[] | null }]

  const totalPages = Math.ceil((totalItems || 0) / ITEMS_PER_PAGE)

  // Fetch settings for whatsapp
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single()

  const whatsapp = (settings as unknown as { whatsapp?: string })?.whatsapp

  return (
    <div className="pt-32 md:pt-36 pb-20 md:pb-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        {/* Header */}
        <div className="relative mb-10 md:mb-16">
          <span className="font-[var(--font-display-ghost)] text-[var(--font-size-display-ghost)] absolute -top-12 md:-top-16 -left-4 md:-left-8 opacity-[0.03] ghost-text hidden md:block">
            MOTO
          </span>
          <div className="relative z-10">
            <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary mb-2">
              CATALOGUE // {new Date().getFullYear()}
            </p>
            <h1 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] md:text-[var(--font-size-headline-xl)] uppercase leading-none">
              PREMIUM<br />INVENTARIS
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[var(--spacing-gutter)]">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6 md:space-y-10">
            {/* Category Filter */}
            <CategoryFilter
              categories={categories ?? []}
              selectedCategory={selectedCategory}
            />

            {/* Notice Card */}
            <div className="p-3 md:p-[var(--spacing-gutter)] border border-white/5 bg-surface-container-lowest">
              <p className="font-[var(--font-label-technical)] text-[10px] text-text-muted mb-3 md:mb-4">
                PEMBERITAHUAN LAYANAN
              </p>
              <p className="font-[var(--font-body-md)] text-[13px] md:text-[14px] text-on-surface-variant">
                Pemasangan suku cadang tersedia di bengkel kami.
              </p>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} whatsapp={whatsapp} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-[var(--font-body-lg)] text-[var(--font-size-body-lg)] text-text-muted">
                  Tidak ada produk di kategori ini.
                </p>
                <Link
                  href="/produk"
                  className="inline-block mt-4 text-primary hover:underline"
                >
                  Lihat semua produk →
                </Link>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/produk"
              searchParams={selectedCategory ? { category: selectedCategory } : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

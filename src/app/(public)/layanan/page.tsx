import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ServiceCard, ServiceCategoryFilter, Pagination } from '@/components/public'
import type { ServiceCategory, Service } from '@/types/database.types'

const ITEMS_PER_PAGE = 12

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const selectedCategory = params.category
  const currentPage = Math.max(1, parseInt(params.page || '1'))

  // Fetch service categories
  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: ServiceCategory[] | null }

  // Count total items
  let countQuery = supabase
    .from('services')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  let dataQuery = supabase
    .from('services')
    .select('*, service_categories(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (selectedCategory) {
    const categoryId = parseInt(selectedCategory)
    countQuery = countQuery.eq('category_id', categoryId)
    dataQuery = dataQuery.eq('category_id', categoryId)
  }

  const [{ count: totalItems }, { data: services }] = await Promise.all([
    countQuery,
    dataQuery.range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1),
  ]) as [{ count: number | null }, { data: Service[] | null }]

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
            SERVICE
          </span>
          <div className="relative z-10">
            <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary mb-2">
              Layanan Tersedia
            </p>
            <h1 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] md:text-[var(--font-size-headline-xl)] uppercase leading-tight">
              ENGINEERED FOR THE RIDE.
            </h1>
            <div className="w-16 h-[2px] bg-primary mt-4 md:mt-6"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[var(--spacing-gutter)]">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6 md:space-y-10">
            {/* Category Filter */}
            <ServiceCategoryFilter
              categories={categories ?? []}
              selectedCategory={selectedCategory}
            />

            {/* Notice Card */}
            <div className="p-3 md:p-[var(--spacing-gutter)] border border-white/5 bg-surface-container-lowest">
              <p className="font-[var(--font-label-technical)] text-[10px] text-text-muted mb-3 md:mb-4">
                JAM OPERASIONAL
              </p>
              <p className="font-[var(--font-body-md)] text-[13px] md:text-[14px] text-on-surface-variant">
                SEN — SAB: 08:00 — 19:00
              </p>
            </div>
          </aside>

          {/* Service Grid */}
          <div className="flex-grow">
            {services && services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[var(--spacing-gutter)]">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} whatsapp={whatsapp} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-[var(--font-body-lg)] text-[var(--font-size-body-lg)] text-text-muted">
                  Tidak ada layanan di kategori ini.
                </p>
                <Link
                  href="/layanan"
                  className="inline-block mt-4 text-primary hover:underline"
                >
                  Lihat semua layanan →
                </Link>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/layanan"
              searchParams={selectedCategory ? { category: selectedCategory } : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

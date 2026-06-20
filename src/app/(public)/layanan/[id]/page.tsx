import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { IconBrandWhatsapp, IconArrowLeft, IconClock } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/server'
import { ServiceCard } from '@/components/public'
import type { Service } from '@/types/database.types'
import { safeImageSrc } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch service
  const { data: rawService } = await supabase
    .from('services')
    .select('*, service_categories(name)')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!rawService) {
    notFound()
  }

  const service = rawService as Service & { service_categories: { name: string } | null }

  // Fetch related services (same category, excluding current)
  let relatedServices: Service[] | null = null
  if (service.category_id) {
    const result = await supabase
      .from('services')
      .select('*')
      .eq('category_id', service.category_id)
      .eq('is_active', true)
      .neq('id', service.id)
      .limit(3)
    relatedServices = result.data as Service[] | null
  }

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
        {/* Breadcrumb */}
        <Link
          href="/layanan"
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 md:mb-8"
        >
          <IconArrowLeft size={16} />
          Kembali ke Layanan
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-[var(--spacing-gutter)]">
          {/* Image */}
          <div className="relative aspect-video bg-surface-card border border-white/10 overflow-hidden">
            <Image
              src={safeImageSrc(service.image)}
              alt={service.name}
              fill
              className="object-cover"
              priority
            />
            {service.is_featured && (
              <span className="absolute top-4 left-4 px-4 py-2 bg-primary text-on-primary font-[var(--font-label-technical)] uppercase">
                UNGGULAN
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category */}
            {service.service_categories && (
              <span className="font-[var(--font-label-technical)] text-[10px] px-2 py-1 border border-white/20 text-text-secondary uppercase">
                {service.service_categories.name}
              </span>
            )}

            {/* Title */}
            <h1 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
              {service.name}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-6">
              {service.duration && (
                <div className="flex items-center gap-2 text-text-muted">
                  <IconClock size={20} />
                  <span className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)]">
                    {service.duration}
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <span className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase">
                Mulai Dari
              </span>
              <p className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] text-primary">
                Rp {service.price_from.toLocaleString('id-ID')}
              </p>
            </div>

            {/* Description */}
            {service.description && (
              <div className="space-y-4">
                <h3 className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary uppercase">
                  Tentang Layanan Ini
                </h3>
                <p className="font-[var(--font-body-lg)] text-[var(--font-size-body-lg)] text-on-surface whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="pt-6">
              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in ${service.name} service`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-on-primary font-bold py-4 uppercase flex items-center justify-center gap-2 hover:bg-primary-container transition-colors"
                >
                  <IconBrandWhatsapp size={20} />
                  PESAN VIA WA
                </a>
              ) : (
                <button className="w-full bg-primary text-on-primary font-bold py-4 uppercase flex items-center justify-center gap-2">
                  <IconBrandWhatsapp size={20} />
                  HUBUNGI UNTUK PEMESANAN
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices && relatedServices.length > 0 && (
          <section className="mt-16 md:mt-20">
            <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase mb-6 md:mb-8">
              Related <span className="text-primary">Services</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-[var(--spacing-gutter)]">
              {relatedServices.map((s) => (
                <ServiceCard key={s.id} service={s} whatsapp={whatsapp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

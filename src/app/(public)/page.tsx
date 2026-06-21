import Link from 'next/link'
import Image from 'next/image'
import { IconArrowForward } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/server'
import { HeroCarousel, ProductCard, ServiceCard } from '@/components/public'
import type { Hero, Product, Service, About, Settings } from '@/types/database.types'
import { safeImageSrc } from '@/lib/utils'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch active heroes
  const { data: heroes } = await supabase
    .from('heroes')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: Hero[] | null }

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(3) as { data: Product[] | null }

  // Fetch featured services
  const { data: featuredServices } = await supabase
    .from('services')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(4) as { data: Service[] | null }

  // Fetch about info
  const { data: about } = await supabase
    .from('abouts')
    .select('*')
    .limit(1)
    .single() as { data: About | null }

  // Fetch settings for whatsapp
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single() as { data: Settings | null }

  const whatsapp = settings?.whatsapp ?? undefined

  return (
    <>
      <HeroCarousel heroes={heroes || []} />

      {/* Stats Block */}
      <section className="bg-surface-elevated py-8 md:py-12 border-y border-white/5 relative z-20">
        <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-[var(--spacing-gutter)] text-center">
            <div className="space-y-1 py-4 md:py-0">
              <h3 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-sm)] md:text-[var(--font-size-headline-md)] text-primary">
                500+
              </h3>
              <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] uppercase text-on-surface-variant tracking-widest">
                Proyek Selesai
              </p>
            </div>
            <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-white/10 py-4 md:py-0">
              <h3 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-sm)] md:text-[var(--font-size-headline-md)] text-primary">
                50+
              </h3>
              <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] uppercase text-on-surface-variant tracking-widest">
                Mekanik Ahli
              </p>
            </div>
            <div className="space-y-1 py-4 md:py-0">
              <h3 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-sm)] md:text-[var(--font-size-headline-md)] text-primary">
                100%
              </h3>
              <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] uppercase text-on-surface-variant tracking-widest">
                Jaminan Kualitas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-12 md:py-[var(--spacing-margin-desktop)] relative">
          <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-16">
              <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] md:text-[var(--font-size-headline-xl)] uppercase">
                The <span className="text-primary">Gear</span>
              </h2>
              <Link href="/produk" className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted hover:text-primary transition-colors">
                LIHAT SEMUA →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-[var(--spacing-gutter)]">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} whatsapp={whatsapp} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Preview */}
      {about && (
        <section className="py-12 md:py-[var(--spacing-margin-desktop)] bg-surface-container-lowest relative overflow-hidden">
          {/* Ghost Text */}
          <div className="absolute top-0 right-12 h-full flex items-center pointer-events-none opacity-5 hidden lg:block">
            <span className="font-[var(--font-display-ghost)] text-[180px] lg:text-[240px] leading-none uppercase select-none rotate-90 origin-center whitespace-nowrap outline-text">
              07 GARAGE
            </span>
          </div>

          <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-[var(--spacing-gutter)] items-center">
            <div className="relative group">
              <div className="absolute -inset-2 md:-inset-4 border border-primary/20 -z-10 group-hover:inset-0 transition-all duration-500" />
              <Image
                src={safeImageSrc(about.image)}
                alt={about.name}
                width={600}
                height={500}
                className="w-full grayscale brightness-75 contrast-125 object-cover aspect-[4/3]"
              />
              <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-primary text-on-primary px-3 md:px-4 py-2 font-[var(--font-label-technical)] text-[10px] md:text-[var(--font-size-label-technical)] uppercase tracking-widest">
                EST. 2018 / BORN IN THE GARAGE
              </div>
            </div>
            <div className="lg:pl-0 xl:pl-12">
              <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] md:text-[var(--font-size-headline-xl)] uppercase mb-4 md:mb-6 leading-tight">
                ENGINEERED <br />
                <span className="text-primary">FOR SOULS.</span>
              </h2>
              <p className="font-[var(--font-body-md)] md:text-[var(--font-size-body-lg)] text-on-surface-variant mb-4 md:mb-6 max-w-2xl line-clamp-3 md:line-clamp-none">
                {about.description || '07 Garage isn\'t just a workshop; it\'s a sanctuary for high-performance machinery and the culture that drives it. Founded by a collective of industrial designers and master mechanics, we specialize in the restoration and transformation of classic motorcycles into contemporary masterpieces.'}
              </p>
              <Link
                href="/tentang"
                className="inline-flex items-center gap-3 md:gap-4 text-primary font-bold uppercase tracking-widest group hover:text-white transition-colors text-sm md:text-base"
              >
                Pelajari Lebih Lanjut
                <IconArrowForward size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Services */}
      {featuredServices && featuredServices.length > 0 && (
        <section className="py-12 md:py-[var(--spacing-margin-desktop)] relative">
          <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-16">
              <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] md:text-[var(--font-size-headline-xl)] uppercase">
                Our <span className="text-primary">Services</span>
              </h2>
              <Link href="/layanan" className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted hover:text-primary transition-colors">
                LIHAT SEMUA →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-[var(--spacing-gutter)]">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} whatsapp={whatsapp} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-[var(--spacing-margin-desktop)] bg-surface-elevated relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 hidden md:block">
          <span className="font-[var(--font-display-ghost)] text-[150px] lg:text-[200px] leading-none uppercase select-none outline-text">
            07 GARAGE
          </span>
        </div>
        <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] text-center relative z-10">
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] md:text-[var(--font-size-headline-xl)] uppercase mb-4 md:mb-6">
            Ready to <span className="text-primary">Transform</span> Your Ride?
          </h2>
          <p className="font-[var(--font-body-md)] md:text-[var(--font-size-body-lg)] text-on-surface-variant mb-6 md:mb-10 max-w-2xl mx-auto">
            Whether you need a full restoration or just a tune-up, our team of experts is ready to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              href="/layanan"
              className="bg-primary text-on-primary px-8 md:px-10 py-3 md:py-4 font-bold uppercase tracking-wider md:tracking-widest hover:bg-primary-container transition-colors text-sm md:text-base"
            >
              LIHAT LAYANAN
            </Link>
            <Link
              href="/kontak"
              className="border border-white text-white px-8 md:px-10 py-3 md:py-4 font-bold uppercase tracking-wider md:tracking-widest hover:bg-white hover:text-black transition-colors text-sm md:text-base"
            >
              HUBUNGI KAMI
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

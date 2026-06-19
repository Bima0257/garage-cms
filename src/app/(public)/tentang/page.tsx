import Link from 'next/link'
import Image from 'next/image'
import { IconMapPin, IconPhone, IconMail, IconBrandWhatsapp } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/server'
import type { About, SocialMedia } from '@/types/database.types'
import { safeImageSrc } from '@/lib/utils'

export default async function AboutPage() {
  const supabase = await createClient()

  // Fetch about info
  const { data: about } = await supabase
    .from('abouts')
    .select('*')
    .limit(1)
    .single() as { data: About | null }

  // Fetch social media
  const { data: socialMedia } = await supabase
    .from('social_media')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: SocialMedia[] | null }

  const openingHours = about?.opening_hours as Record<string, string> | null

  return (
    <div className="pt-32 md:pt-36 pb-20 md:pb-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        {/* Hero / Brand Story */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-[var(--spacing-gutter)] items-center mb-16 md:mb-32">
          {/* Image */}
          <div className="lg:col-span-5 relative group order-1">
            <div className="absolute -inset-2 md:-inset-4 border border-primary/20 -z-10 group-hover:inset-0 transition-all duration-500" />
            {safeImageSrc(about?.image) ? (
              <Image
                src={safeImageSrc(about?.image)!}
                alt={about?.name ?? ''}
                width={600}
                height={500}
                className="w-full grayscale brightness-75 contrast-125 object-cover aspect-[4/3]"
              />
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600"
                alt="About"
                width={600}
                height={500}
                className="w-full grayscale brightness-75 contrast-125 object-cover aspect-[4/3]"
              />
            )}
            <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-primary text-on-primary px-3 md:px-4 py-2 font-[var(--font-label-technical)] text-[10px] md:text-[var(--font-size-label-technical)] uppercase tracking-widest">
              EST. 2018 / BORN IN THE GARAGE
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 lg:pl-0 xl:lg:pl-12 order-2">
            <h1 className="font-[var(--font-display-lg)] text-[var(--font-size-headline-xl)] md:text-[var(--font-size-display-lg)] uppercase mb-4 md:mb-8 leading-none">
              ENGINEERED <br />
              <span className="text-primary">FOR SOULS.</span>
            </h1>
            <p className="font-[var(--font-body-lg)] text-[var(--font-size-body-lg)] text-on-surface-variant mb-4 md:mb-6 max-w-2xl">
              {about?.description || 'STEED isn\'t just a workshop; it\'s a sanctuary for high-performance machinery and the culture that drives it. Founded by a collective of industrial designers and master mechanics, we specialize in the restoration and transformation of classic motorcycles into contemporary masterpieces.'}
            </p>
            <p className="font-[var(--font-body-md)] text-[var(--font-size-body-md)] text-text-muted mb-6 md:mb-10 max-w-2xl">
              Every bolt turned and every weld fused in our facility is a testament to our obsession with mechanical integrity. We bridge the gap between vintage soul and modern reliability using surgical precision and high-grade materials.
            </p>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 border-t border-white/10 pt-6 md:pt-10">
              <div>
                <span className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary uppercase block mb-2">
                  Service Excellence
                </span>
                <p className="font-[var(--font-body-md)] text-[var(--font-size-body-md)] text-on-surface">
                  Precision tuning for high-compression engines and custom fabrication.
                </p>
              </div>
              <div>
                <span className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary uppercase block mb-2">
                  Heritage First
                </span>
                <p className="font-[var(--font-body-md)] text-[var(--font-size-body-md)] text-on-surface">
                  Preserving the spirit of cafe racer culture through timeless design.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[var(--spacing-gutter)] mb-16 md:mb-32">
          {/* Location */}
          <div className="bg-surface-card border border-white/10 p-5 md:p-8 lg:p-10 flex flex-col items-start hover:border-primary/40 transition-colors">
            <IconMapPin className="text-primary text-3xl md:text-4xl mb-4 md:mb-6" />
            <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-sm)] md:text-[var(--font-size-headline-md)] uppercase mb-3 md:mb-4">
              HEADQUARTERS
            </h3>
            <p className="text-on-surface-variant text-sm md:text-base">
              {about?.address || '42 Industrial Drive, Bay Area\nSan Francisco, CA 94107'}
            </p>
            {openingHours && (
              <div className="mt-4 md:mt-8 font-[var(--font-label-technical)] text-[10px] md:text-[var(--font-size-label-technical)] text-text-muted">
                {Object.entries(openingHours).map(([day, hours]) => (
                  <p key={day}>{day}: {hours}</p>
                ))}
              </div>
            )}
          </div>

          {/* Direct Lines */}
          <div className="bg-surface-card border border-white/10 p-5 md:p-8 lg:p-10 flex flex-col items-start hover:border-primary/40 transition-colors">
            <IconPhone className="text-primary text-3xl md:text-4xl mb-4 md:mb-6" />
            <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-sm)] md:text-[var(--font-size-headline-md)] uppercase mb-3 md:mb-4">
              KONTAK LANGSUNG
            </h3>
            {about?.phone && (
              <p className="text-on-surface-variant text-sm md:text-base mb-2">
                Workshop: {about.phone}
              </p>
            )}
            {about?.whatsapp && (
              <a
                href={`https://wa.me/${about.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 md:mt-8 flex items-center gap-2 text-whatsapp-green font-bold hover:underline"
              >
                <IconBrandWhatsapp size={18} />
                CHAT WHATSAPP
              </a>
            )}
          </div>

          {/* Digital Feed */}
          <div className="bg-surface-card border border-white/10 p-5 md:p-8 lg:p-10 flex flex-col items-start hover:border-primary/40 transition-colors sm:col-span-2 lg:col-span-1">
            <IconMail className="text-primary text-3xl md:text-4xl mb-4 md:mb-6" />
            <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-sm)] md:text-[var(--font-size-headline-md)] uppercase mb-3 md:mb-4">
              UMPAN DIGITAL
            </h3>
            {about?.email && (
              <p className="text-on-surface-variant text-sm md:text-base mb-2">
                {about.email}
              </p>
            )}
            {socialMedia && socialMedia.length > 0 && (
              <div className="mt-4 md:mt-8 flex gap-4">
                {socialMedia.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary transition-colors text-sm font-bold"
                  >
                    {social.platform.substring(0, 2).toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] md:text-[var(--font-size-headline-xl)] uppercase mb-4 md:mb-6">
            Ready to Start Your <span className="text-primary">Project</span>?
          </h2>
          <p className="font-[var(--font-body-lg)] text-[var(--font-size-body-lg)] text-on-surface-variant mb-6 md:mb-8 max-w-2xl mx-auto">
            Whether you need a full restoration or just a tune-up, our team is ready to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              href="/kontak"
              className="bg-primary text-on-primary px-8 md:px-10 py-3 md:py-4 font-bold uppercase tracking-widest hover:bg-primary-container transition-colors"
            >
              HUBUNGI KAMI
            </Link>
            {about?.whatsapp && (
              <a
                href={`https://wa.me/${about.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-whatsapp-green text-whatsapp-green px-8 md:px-10 py-3 md:py-4 font-bold uppercase tracking-widest hover:bg-whatsapp-green/10 transition-colors flex items-center justify-center gap-2"
              >
                <IconBrandWhatsapp size={18} />
                WHATSAPP
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

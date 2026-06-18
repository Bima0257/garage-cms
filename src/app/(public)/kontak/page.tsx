import { IconMapPin, IconPhone, IconMail, IconBrandWhatsapp } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/server'
import { ContactForm } from '@/components/public'
import type { About, SocialMedia } from '@/types/database.types'

export default async function ContactPage() {
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
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <h1 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] md:text-[var(--font-size-headline-xl)] uppercase mb-4 md:mb-6">
            PERTANYAAN <span className="text-primary">PROYEK</span>
          </h1>
          <p className="font-[var(--font-body-lg)] text-[var(--font-size-body-lg)] text-on-surface-variant max-w-2xl">
            Have a project in mind? Get in touch with us and let&apos;s discuss how we can bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-[var(--spacing-gutter)]">
          {/* Contact Form */}
          <div className="bg-surface-elevated border border-white/5 p-5 md:p-8 lg:p-12 amber-glow order-2 lg:order-1">
            <ContactForm whatsapp={about?.whatsapp || undefined} />
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-4 md:space-y-[var(--spacing-gutter)] order-1 lg:order-2">
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-[var(--spacing-gutter)]">
              {/* Location */}
              <div className="bg-surface-card border border-white/10 p-4 md:p-6 hover:border-primary/40 transition-colors">
                <IconMapPin className="text-primary text-2xl md:text-3xl mb-3 md:mb-4" />
                <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-sm)] md:text-[var(--font-size-headline-md)] uppercase mb-2">
                  LOKASI
                </h3>
                <p className="text-text-secondary text-[13px] md:text-sm">
                  {about?.address || '42 Industrial Drive\nSan Francisco, CA 94107'}
                </p>
                {openingHours && (
                  <div className="mt-3 md:mt-4 font-[var(--font-label-technical)] text-[10px] text-text-muted uppercase">
                    {Object.entries(openingHours).map(([day, hours]) => (
                      <p key={day}>{day}: {hours}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="bg-surface-card border border-white/10 p-4 md:p-6 hover:border-primary/40 transition-colors">
                <IconPhone className="text-primary text-2xl md:text-3xl mb-3 md:mb-4" />
                <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-sm)] md:text-[var(--font-size-headline-md)] uppercase mb-2">
                  KONTAK
                </h3>
                {about?.phone && (
                  <p className="text-text-secondary text-[13px] md:text-sm mb-2">
                    {about.phone}
                  </p>
                )}
                {about?.whatsapp && (
                  <a
                    href={`https://wa.me/${about.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-whatsapp-green font-bold text-[13px] md:text-sm hover:underline"
                  >
                    <IconBrandWhatsapp size={16} />
                    WhatsApp
                  </a>
                )}
              </div>

              {/* Email */}
              <div className="bg-surface-card border border-white/10 p-4 md:p-6 hover:border-primary/40 transition-colors">
                <IconMail className="text-primary text-2xl md:text-3xl mb-3 md:mb-4" />
                <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-sm)] md:text-[var(--font-size-headline-md)] uppercase mb-2">
                  EMAIL
                </h3>
                {about?.email && (
                  <a
                    href={`mailto:${about.email}`}
                    className="text-text-secondary text-[13px] md:text-sm hover:text-primary transition-colors"
                  >
                    {about.email}
                  </a>
                )}
              </div>

              {/* Social */}
              <div className="bg-surface-card border border-white/10 p-4 md:p-6 hover:border-primary/40 transition-colors">
                <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-sm)] md:text-[var(--font-size-headline-md)] uppercase mb-3 md:mb-4">
                  SOSIAL
                </h3>
                {socialMedia && socialMedia.length > 0 ? (
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {socialMedia.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-primary transition-colors text-[13px] md:text-sm font-bold"
                      >
                        {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-muted text-[13px] md:text-sm">Ikuti kami di media sosial</p>
                )}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-48 md:h-64 bg-surface-card border border-white/10 relative overflow-hidden group">
              {about?.google_maps ? (
                <iframe
                  src={about.google_maps}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale contrast-125 opacity-60 group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <IconMapPin className="text-primary text-3xl md:text-4xl mx-auto mb-2" />
                    <p className="text-text-muted text-[13px] md:text-sm">Lokasi peta</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

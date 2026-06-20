import { createClient } from '@/lib/supabase/server'
import { Navbar, Footer, PromoModal, ScrollToTop } from '@/components/public'
import { IconBrandWhatsapp } from '@tabler/icons-react'
import type { Settings, About, SocialMedia, ModalPromotion } from '@/types/database.types'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Fetch settings
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single() as { data: Settings | null }

  // Fetch abouts for whatsapp number
  const { data: about } = await supabase
    .from('abouts')
    .select('whatsapp')
    .limit(1)
    .single() as { data: { whatsapp: string | null } | null }

  // Fetch social media
  const { data: socialMedia } = await supabase
    .from('social_media')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: SocialMedia[] | null }

  // Fetch active promotion
  const now = new Date().toISOString()
  const { data: activePromotion } = await supabase
    .from('modal_promotions')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', now)
    .gte('end_date', now)
    .limit(1)
    .single() as { data: ModalPromotion | null }

  const whatsapp = about?.whatsapp || undefined

  return (
    <div className="min-h-screen flex flex-col">
      {/* Atmospheric blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent-red/5 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <Navbar
        siteName={settings?.site_name}
        whatsapp={whatsapp}
      />

      {/* Main Content */}
      <main className="flex-grow pt-20 pb-24 md:pb-0">
        {children}
      </main>

      {/* Footer */}
      <Footer settings={settings as Settings | null} socialMedia={socialMedia ?? undefined} />

      {/* Promo Modal */}
      <PromoModal promotion={activePromotion as ModalPromotion | null} />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* WhatsApp Floating Button */}
      {whatsapp && (
        <a
          href={'https://wa.me/' + whatsapp.replace(/\D/g, '')}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[100] bg-whatsapp-green text-white w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full shadow-xl hover:shadow-whatsapp-green/25 hover:scale-110 active:scale-95 transition-all duration-300 group"
          aria-label="Chat via WhatsApp"
        >
          <IconBrandWhatsapp size={26} className="md:hidden" />
          <IconBrandWhatsapp size={30} className="hidden md:block" />
          <span className="absolute right-full mr-4 bg-background border border-white/10 text-text-primary px-4 py-2 font-[var(--font-label-technical)] text-xs uppercase whitespace-nowrap rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg hidden md:block">
            Konsultasi dengan Ahli
          </span>
        </a>
      )}
    </div>
  )
}

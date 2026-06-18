import Link from 'next/link'
import { IconBrandInstagram, IconBrandYoutube, IconBrandFacebook, IconBrandTwitter } from '@tabler/icons-react'
import type { SocialMedia, Settings } from '@/types/database.types'

interface FooterProps {
  settings?: Settings | null
  socialMedia?: SocialMedia[]
}

const iconMap: Record<string, React.ReactNode> = {
  instagram: <IconBrandInstagram size={20} />,
  youtube: <IconBrandYoutube size={20} />,
  facebook: <IconBrandFacebook size={20} />,
  twitter: <IconBrandTwitter size={20} />,
}

export function Footer({ settings, socialMedia }: FooterProps) {
  const siteName = settings?.site_name || 'STEED'
  const tagline = settings?.tagline || 'Engineered for Performance'
  const footerText = settings?.footer_text || '© 2024 STEED MOTORWORKS. ENGINEERED FOR PERFORMANCE.'
  const activeSocialMedia = socialMedia?.filter((s) => s.is_active) || []

  return (
    <footer className="w-full py-12 md:py-[var(--spacing-margin-desktop)] mt-auto bg-surface-container-lowest border-t border-white/5 relative overflow-hidden">
      {/* Ghost text decoration */}
      <div
        className="font-[var(--font-display-ghost)] text-[var(--font-size-display-ghost)] opacity-5 absolute -top-8 md:-top-12 left-0 pointer-events-none hidden md:block"
      >
        {siteName}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-[var(--spacing-gutter)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto relative z-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link
            href="/"
            className="font-[var(--font-display-lg)] text-[var(--font-size-headline-sm)] md:text-[var(--font-size-headline-md)] text-primary font-bold tracking-tighter mb-4 md:mb-8 block"
          >
            {siteName}
          </Link>
          <p className="font-[var(--font-body-md)] text-[var(--font-size-body-sm)] md:text-[var(--font-size-body-md)] text-text-muted max-w-xs">
            {tagline}
          </p>
        </div>

        {/* Explore */}
        <div className="flex flex-col gap-2 md:gap-4">
          <span className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary uppercase mb-1 md:mb-0">
            Jelajahi
          </span>
          <Link href="/" className="font-[var(--font-body-md)] text-[var(--font-size-body-sm)] md:text-[var(--font-size-body-md)] text-text-muted hover:text-on-surface transition-colors">
            TENTANG
          </Link>
          <Link href="/produk" className="font-[var(--font-body-md)] text-[var(--font-size-body-sm)] md:text-[var(--font-size-body-md)] text-text-muted hover:text-on-surface transition-colors">
            PRODUK
          </Link>
          <Link href="/layanan" className="font-[var(--font-body-md)] text-[var(--font-size-body-sm)] md:text-[var(--font-size-body-md)] text-text-muted hover:text-on-surface transition-colors">
            LAYANAN
          </Link>
          <Link href="/kontak" className="font-[var(--font-body-md)] text-[var(--font-size-body-sm)] md:text-[var(--font-size-body-md)] text-text-muted hover:text-on-surface transition-colors">
            KONTAK
          </Link>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-2 md:gap-4">
          <span className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary uppercase mb-1 md:mb-0">
            Hukum
          </span>
          <Link href="#" className="font-[var(--font-body-md)] text-[var(--font-size-body-sm)] md:text-[var(--font-size-body-md)] text-text-muted hover:text-on-surface transition-colors">
            PRIVASI
          </Link>
          <Link href="#" className="font-[var(--font-body-md)] text-[var(--font-size-body-sm)] md:text-[var(--font-size-body-md)] text-text-muted hover:text-on-surface transition-colors">
            KETENTUAN
          </Link>
        </div>

        {/* Subscribe / Social */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-3 md:gap-4">
          <span className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary uppercase">
            Ikuti Kami
          </span>
          <div className="flex gap-4">
            {activeSocialMedia.map((social) => (
              <Link
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-primary transition-colors"
              >
                {iconMap[social.platform.toLowerCase()] || (
                  <span className="text-sm">{social.platform.charAt(0)}</span>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-2 md:mt-4 flex border-b border-white/10 pb-2">
            <input
              className="bg-transparent border-none focus:ring-0 text-sm font-[var(--font-label-technical)] w-full text-white placeholder:text-text-muted"
              placeholder="ALAMAT EMAIL"
              type="email"
            />
            <button className="text-primary hover:translate-x-1 transition-transform">
              →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 md:gap-4 text-center">
        <p className="font-[var(--font-label-technical)] text-[9px] md:text-[10px] uppercase text-text-muted tracking-[0.15em] md:tracking-[0.2em]">
          {footerText}
        </p>
        <div className="flex gap-4 md:gap-6 justify-center">
          <span className="font-[var(--font-label-technical)] text-[9px] md:text-[10px] uppercase text-text-muted">
            ISO 9001
          </span>
          <span className="font-[var(--font-label-technical)] text-[9px] md:text-[10px] uppercase text-text-muted">
            GLOBAL
          </span>
        </div>
      </div>
    </footer>
  )
}

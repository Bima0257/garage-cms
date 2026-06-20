'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { IconHome, IconPackages, IconTool, IconInfoCircle, IconPhone, IconSearch } from '@tabler/icons-react'

interface NavbarProps {
  siteName?: string
  whatsapp?: string
}

const navLinks = [
  { href: '/', label: 'Beranda', icon: IconHome },
  { href: '/produk', label: 'Produk', icon: IconPackages },
  { href: '/layanan', label: 'Layanan', icon: IconTool },
  { href: '/tentang', label: 'Tentang', icon: IconInfoCircle },
  { href: '/kontak', label: 'Kontak', icon: IconPhone },
]

function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
      setQuery('')
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/cari?q=${encodeURIComponent(trimmed)}`)
      setOpen(false)
      onNavigate?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      {open ? (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk atau layanan..."
            className="w-48 lg:w-64 h-9 px-3 bg-background border border-outline-variant text-text-primary text-sm focus:outline-none focus:border-primary transition-colors font-[var(--font-label-technical)]"
            onBlur={() => { if (!query) setOpen(false) }}
          />
          <button
            type="submit"
            className="p-1.5 text-text-muted hover:text-primary transition-colors"
            aria-label="Cari"
          >
            <IconSearch size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 text-text-muted hover:text-primary transition-colors"
          aria-label="Buka pencarian"
        >
          <IconSearch size={20} />
        </button>
      )}
    </form>
  )
}

export function Navbar({ siteName = '07 Garage', whatsapp }: NavbarProps) {
  const pathname = usePathname()

  const openWhatsApp = () => {
    if (whatsapp) {
      window.open('https://wa.me/' + whatsapp.replace(/\D/g, ''), '_blank')
    }
  }

  return (
    <>
      {/* Mobile Top Header - Logo + Search */}
      <header className="md:hidden fixed top-0 w-full z-[60] bg-background/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="font-[var(--font-display-lg)] text-[var(--font-size-headline-sm)] text-primary font-bold tracking-tighter"
          >
            {siteName}
          </Link>
          <SearchBar onNavigate={() => {}} />
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center px-[var(--spacing-margin-desktop)] py-[var(--spacing-unit)] max-w-[var(--spacing-container-max)] mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="font-[var(--font-display-lg)] text-[var(--font-size-headline-md)] text-primary font-bold tracking-tighter"
          >
            {siteName}
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex gap-10 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-[var(--font-headline-md)] text-[var(--font-size-headline-md)] uppercase tracking-widest transition-colors ${
                  pathname === link.href
                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Search + CTA */}
          <div className="flex items-center gap-4">
            <SearchBar />
            <button
              onClick={openWhatsApp}
              className="bg-primary text-on-primary px-6 py-2 font-bold uppercase text-sm tracking-widest active:scale-95 transition-transform"
            >
              {whatsapp ? 'KONSULTASI VIA WA' : 'HUBUNGI KAMI'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-white/10">
        <div className="flex justify-around items-center py-2 px-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-[60px] transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-on-surface-variant'
                }`}
              >
                <Icon size={22} stroke={isActive ? 2.5 : 2} />
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

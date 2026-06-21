'use client'

import Image from 'next/image'
import { IconBrandWhatsapp, IconClock } from '@tabler/icons-react'
import type { Service } from '@/types/database.types'
import { safeImageSrc } from '@/lib/utils'

interface ServiceCardProps {
  service: Service
  whatsapp?: string
  onWhatsAppClick?: (service: Service) => void
}

export function ServiceCard({ service, whatsapp, onWhatsAppClick }: ServiceCardProps) {
  const handleWhatsApp = () => {
    if (onWhatsAppClick) {
      onWhatsAppClick(service)
    } else if (whatsapp) {
      const message = encodeURIComponent(`Hi, saya tertarik dengan ${service.name}`)
      window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank')
    }
  }

  return (
    <div className="bg-surface-card border border-white/10 group relative overflow-hidden transition-all duration-500 hover:border-primary/30">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={safeImageSrc(service.image)}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />

        {/* Featured Badge */}
        {service.is_featured && (
          <span className="absolute top-3 left-3 md:top-4 md:left-4 px-2 py-1 md:px-3 md:py-1 bg-primary text-on-primary font-[var(--font-label-technical)] text-[9px] md:text-[10px] uppercase">
            UNGGULAN
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-6">
        <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-sm)] sm:text-[var(--font-size-headline-md)] uppercase group-hover:text-primary transition-colors mb-1 sm:mb-2">
          {service.name}
        </h3>
        {service.description && (
          <p className="font-[var(--font-body-md)] text-[var(--font-size-body-sm)] sm:text-[var(--font-size-body-md)] text-text-secondary line-clamp-2 mb-3 sm:mb-4">
            {service.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 text-text-muted">
            <IconClock size={14} className="sm:hidden" />
            <IconClock size={16} className="hidden sm:block" />
            <span className="font-[var(--font-label-technical)] text-[9px] sm:text-[10px]">
              {service.duration || 'Durasi bervariasi'}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3 sm:mb-4">
          <span className="font-[var(--font-label-technical)] text-[9px] sm:text-[10px] text-text-muted uppercase">
            Mulai Dari
          </span>
          <p className="font-[var(--font-headline-md)] text-[var(--font-size-headline-sm)] sm:text-[var(--font-size-headline-md)] text-primary">
            Rp {service.price_from.toLocaleString('id-ID')}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleWhatsApp}
          className="w-full bg-primary text-on-primary font-bold py-2 sm:py-3 uppercase flex items-center justify-center gap-2 hover:bg-primary-container transition-colors active:scale-[0.98] text-xs sm:text-sm"
        >
          <IconBrandWhatsapp size={16} className="sm:hidden" />
          <IconBrandWhatsapp size={18} className="hidden sm:block" />
          <span className="hidden sm:inline">PESAN VIA WA</span>
          <span className="sm:hidden">WA</span>
        </button>
      </div>
    </div>
  )
}

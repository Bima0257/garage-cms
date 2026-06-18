'use client'

import Image from 'next/image'
import { IconBrandWhatsapp } from '@tabler/icons-react'
import type { Product } from '@/types/database.types'
import { safeImageSrc } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  whatsapp?: string
  onWhatsAppClick?: (product: Product) => void
}

const stockStatusLabels: Record<string, { label: string; className: string }> = {
  in_stock: { label: 'Tersedia', className: 'bg-whatsapp-green/10 text-whatsapp-green border-whatsapp-green/30' },
  limited: { label: 'Terbatas', className: 'bg-primary-container/10 text-primary-container border-primary-container/30' },
  out_of_stock: { label: 'Habis', className: 'bg-accent-red/10 text-accent-red border-accent-red/30' },
}

export function ProductCard({ product, whatsapp, onWhatsAppClick }: ProductCardProps) {
  const stockInfo = stockStatusLabels[product.stock_status ?? 'in_stock'] || stockStatusLabels.in_stock
  const displayPrice = product.discount_price ?? product.price
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price

  const handleWhatsApp = () => {
    if (onWhatsAppClick) {
      onWhatsAppClick(product)
    } else if (whatsapp) {
      const message = encodeURIComponent(`Hi, saya tertarik dengan ${product.name}`)
      window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank')
    }
  }

  return (
    <div className="bg-surface-card border border-white/10 group relative overflow-hidden transition-all duration-500 hover:border-primary/30">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        {safeImageSrc(product.image) ? (
          <Image
            src={safeImageSrc(product.image)!}
            alt={product.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full bg-surface-elevated flex items-center justify-center">
            <span className="text-text-muted">Tidak Ada Gambar</span>
          </div>
        )}

        {/* Stock Badge */}
        <span className={`absolute top-3 right-3 md:top-4 md:right-4 px-2 py-1 md:px-3 md:py-1 font-[var(--font-label-technical)] text-[9px] md:text-[10px] uppercase border ${stockInfo.className}`}>
          {stockInfo.label}
        </span>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 md:top-4 md:left-4 px-2 py-1 md:px-3 md:py-1 bg-primary text-on-primary font-[var(--font-label-technical)] text-[9px] md:text-[10px] uppercase">
            DISKON
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-6">
        <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-sm)] sm:text-[var(--font-size-headline-md)] uppercase group-hover:text-primary transition-colors mb-1 sm:mb-2">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="font-[var(--font-body-md)] text-[var(--font-size-body-sm)] sm:text-[var(--font-size-body-md)] text-text-secondary line-clamp-2 mb-3 sm:mb-4">
            {product.short_description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-baseline gap-2">
            <span className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary">
              Rp {displayPrice.toLocaleString('id-ID')}
            </span>
            {hasDiscount && (
              <span className="font-[var(--font-label-technical)] text-[10px] text-text-muted line-through">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            )}
          </div>
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

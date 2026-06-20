'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { IconX } from '@tabler/icons-react'
import { safeImageSrc } from '@/lib/utils'
import type { ModalPromotion } from '@/types/database.types'

interface PromoModalProps {
  promotion: ModalPromotion | null
}

export function PromoModal({ promotion }: PromoModalProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  const isVisible = useMemo(() => {
    if (!promotion || !promotion.is_active || isDismissed) return false
    const now = new Date()
    const startDate = new Date(promotion.start_date)
    const endDate = new Date(promotion.end_date)
    if (now >= startDate && now <= endDate) {
      if (typeof window !== 'undefined') {
        const dismissedKey = `promo_dismissed_${promotion.id}`
        return !sessionStorage.getItem(dismissedKey)
      }
    }
    return false
  }, [promotion, isDismissed])

  const handleDismiss = () => {
    if (promotion) {
      sessionStorage.setItem(`promo_dismissed_${promotion.id}`, 'true')
    }
    setIsDismissed(true)
  }

  if (!isVisible || !promotion) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal Content */}
      <div className="relative z-10 max-w-2xl w-full mx-4 bg-surface-card border border-white/10 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-white transition-colors z-20"
        >
          <IconX size={24} />
        </button>

        {/* Image */}
        {promotion.image && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={safeImageSrc(promotion.image)}
              alt={promotion.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-8 text-center">
          <h3 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] text-primary uppercase mb-4">
            {promotion.title}
          </h3>
          {promotion.description && (
            <p className="font-[var(--font-body-lg)] text-[var(--font-size-body-lg)] text-on-surface-variant mb-6">
              {promotion.description}
            </p>
          )}
          {promotion.button_text && promotion.button_url && (
            <a
              href={promotion.button_url}
              className="inline-block bg-primary text-on-primary px-10 py-4 font-bold uppercase tracking-widest hover:bg-primary-container transition-colors"
            >
              {promotion.button_text}
            </a>
          )}
        </div>

        {/* Decorative line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  )
}

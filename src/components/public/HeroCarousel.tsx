'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IconArrowForward } from '@tabler/icons-react'
import { safeImageSrc } from '@/lib/utils'
import type { Hero } from '@/types/database.types'

interface HeroCarouselProps {
  heroes: Hero[]
}

export function HeroCarousel({ heroes }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const total = heroes?.length ?? 0

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  useEffect(() => {
    if (total <= 1) return
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [total, next])

  if (!heroes || total === 0) {
    return (
      <section className="relative min-h-screen md:h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/default-img/default.jpg"
            alt="Hero"
            fill
            className="object-cover grayscale-[0.4] contrast-[1.1]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 hidden md:block">
          <span className="font-[var(--font-display-ghost)] text-[200px] md:text-[300px] leading-none uppercase select-none outline-text">
            07 GARAGE
          </span>
        </div>
        <div className="relative z-10 w-full max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] flex justify-between items-end pb-20 md:pb-24">
          <div className="max-w-2xl">
            <h1 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-md)] md:text-[var(--font-size-headline-xl)] lg:text-[var(--font-size-headline-lg)] text-on-surface uppercase mb-3 md:mb-6 leading-[1]">
              ENGINEERED FOR <br />
              <span className="text-primary">THE WILD</span>
            </h1>
            <p className="font-[var(--font-body-md)] text-[var(--font-size-body-md)] md:text-[var(--font-size-body-lg)] text-on-surface-variant mb-4 md:mb-10 max-w-md hidden sm:block">
              Precision-tuned machines for those who demand performance over vanity.
            </p>
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 md:gap-4 bg-primary text-on-primary px-5 md:px-10 py-3 md:py-5 font-bold uppercase tracking-wider md:tracking-widest group hover:bg-white hover:text-black transition-all duration-300 text-sm md:text-base"
            >
              Jelajahi Layanan
              <IconArrowForward size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen md:h-screen flex items-center overflow-hidden">
      {heroes.map((hero, index) => (
        <div
          key={hero.id}
          className={`absolute inset-0 z-0 transition-opacity duration-700 ${
            index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Image
            src={safeImageSrc(hero.image)}
            alt={hero.title}
            fill
            className="object-cover grayscale-[0.4] contrast-[1.1]"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>
      ))}

      {/* Ghost Text Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 hidden md:block">
        <span className="font-[var(--font-display-ghost)] text-[200px] md:text-[300px] leading-none uppercase select-none outline-text">
          07 GARAGE
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] flex justify-between items-end pb-20 md:pb-24">
        <div className="max-w-2xl w-full md:w-auto">
          <div className="transition-opacity duration-700">
            <h1 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-md)] md:text-[var(--font-size-headline-xl)] lg:text-[var(--font-size-headline-lg)] text-on-surface uppercase mb-3 md:mb-6 leading-[1]">
              {(() => {
                const words = heroes[current].title.split(' ')
                if (words.length <= 2) {
                  return <span className="text-primary">{heroes[current].title}</span>
                }
                const main = words.slice(0, -2).join(' ')
                const highlighted = words.slice(-2).join(' ')
                return <>{main} <span className="text-primary">{highlighted}</span></>
              })()}
            </h1>
            <p className="font-[var(--font-body-md)] text-[var(--font-size-body-md)] md:text-[var(--font-size-body-lg)] text-on-surface-variant mb-4 md:mb-10 max-w-md hidden sm:block">
              {heroes[current].description || 'Precision-tuned machines for those who demand performance over vanity.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 md:gap-4 bg-primary text-on-primary px-5 md:px-10 py-3 md:py-5 font-bold uppercase tracking-wider md:tracking-widest group hover:bg-white hover:text-black transition-all duration-300 text-sm md:text-base"
            >
              Jelajahi Layanan
              <IconArrowForward size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>

            {/* Dot Navigation */}
            {total > 1 && (
              <div className="flex items-center gap-2">
                {heroes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === current
                        ? 'bg-primary w-5 md:w-6'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vertical Indicator */}
        <div className="hidden lg:flex flex-col gap-6 mb-24">
          <div className="flex flex-col items-center gap-4">
            <span className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary">
              {(current + 1).toString().padStart(2, '0')}
            </span>
            <div className="w-[2px] h-12 bg-primary"></div>
            <div className="space-y-4 opacity-30">
              {Array.from({ length: Math.min(total, 7) }, (_, i) => i + 1)
                .filter((n) => n !== current + 1)
                .slice(0, 6)
                .map((n) => (
                  <span key={n} className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] block text-center">
                    {n.toString().padStart(2, '0')}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

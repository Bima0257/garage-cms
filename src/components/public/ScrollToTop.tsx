'use client'

import { useEffect, useState } from 'react'
import { IconArrowUp } from '@tabler/icons-react'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed right-4 md:right-8 z-[90] w-10 h-10 md:w-12 md:h-12 bg-surface border border-white/10 flex items-center justify-center
        hover:bg-primary hover:border-primary transition-all duration-300
        active:scale-95
        bottom-[9rem] md:bottom-[7rem]
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      aria-label="Scroll to top"
    >
      <IconArrowUp size={18} className="text-on-surface-variant" />
    </button>
  )
}

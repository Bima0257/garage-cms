'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { IconLoader2 } from '@tabler/icons-react'

export function PageLoader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const targetPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (targetPathRef.current) {
      targetPathRef.current = null
      const timer = setTimeout(() => setVisible(false), 200)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor?.href) return
      const current = new URL(window.location.href)
      const target = new URL(anchor.href)
      if (current.origin === target.origin && current.pathname !== target.pathname) {
        targetPathRef.current = target.pathname
        setVisible(true)
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center">
      <IconLoader2 size={48} className="animate-spin text-primary" />
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function RouteProgressBar() {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname

      setProgress(0)
      setVisible(true)

      let start: number | null = null
      const duration = 300
      let currentProgress = 0

      const animate = (timestamp: number) => {
        if (!start) start = timestamp
        const elapsed = timestamp - start
        currentProgress = Math.min(elapsed / duration, 1)
        setProgress(currentProgress)

        if (currentProgress < 1) {
          frameRef.current = requestAnimationFrame(animate)
        } else {
          setTimeout(() => setVisible(false), 150)
        }
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [pathname])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[999] h-[3px] transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/50 to-primary transition-all duration-75"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}

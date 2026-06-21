'use client'

import { IconLoader2 } from '@tabler/icons-react'

interface RedirectOverlayProps {
  isRedirecting: boolean
}

export function RedirectOverlay({ isRedirecting }: RedirectOverlayProps) {
  if (!isRedirecting) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <IconLoader2 size={48} className="animate-spin text-primary" />
    </div>
  )
}

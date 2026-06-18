'use client'

import { useState } from 'react'
import { IconSearch, IconBell } from '@tabler/icons-react'

export function AdminHeader() {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-[var(--spacing-margin-desktop)]">
      {/* Search */}
      <div
        className={`relative flex items-center bg-background border-b transition-all duration-200 ${
          searchFocused ? 'border-primary ring-1 ring-primary' : 'border-text-muted/30'
        }`}
      >
        <IconSearch size={18} className="absolute left-3 text-text-muted" />
        <input
          type="text"
          placeholder="CARI DATA..."
          className="w-96 h-10 pl-10 pr-4 bg-transparent border-none text-[var(--font-label-technical)] text-text-primary focus:ring-0 placeholder:text-text-muted"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right side */}
      <div className="flex items-end">
        {/* Notifications */}
        <button className="relative text-text-secondary hover:text-primary transition-colors">
          <IconBell size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary border border-background rounded-full" />
        </button>
      </div>
    </header>
  )
}

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { IconSearch, IconBell } from '@tabler/icons-react'

interface AdminHeaderProps {
  unreadCount?: number
}

export function AdminHeader({ unreadCount = 0 }: AdminHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/admin/cari?q=${encodeURIComponent(trimmed)}`)
      setQuery('')
      inputRef.current?.blur()
    }
  }

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-[var(--spacing-margin-desktop)]">
      {/* Search */}
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center bg-background border-b transition-all duration-200 ${
          searchFocused ? 'border-primary ring-1 ring-primary' : 'border-text-muted/30'
        }`}
      >
        <IconSearch size={18} className="absolute left-3 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="CARI DATA..."
          className="w-96 h-10 pl-10 pr-4 bg-transparent border-none text-[var(--font-label-technical)] text-text-primary focus:ring-0 placeholder:text-text-muted"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </form>

      {/* Right side */}
      <div className="flex items-end">
        {/* Notifications */}
        <button
          onClick={() => router.push('/admin/pesan')}
          className="relative text-text-secondary hover:text-primary transition-colors"
        >
          <IconBell size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center rounded-full border border-background px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

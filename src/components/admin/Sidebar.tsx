'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  IconLayoutDashboard,
  IconPackage,
  IconCategory,
  IconTool,
  IconPhoto,
  IconBell,
  IconShare,
  IconArticle,
  IconSettings,
  IconMotorbike,
  IconUser,
  IconWorldWww,
  IconChevronDown,
  IconLogout,
} from '@tabler/icons-react'
import { signOut } from 'next-auth/react'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number }>
}

interface NavGroup {
  label?: string
  icon?: React.ComponentType<{ size?: number }>
  items: NavItem[]
}

interface SidebarProps {
  user?: {
    name?: string | null
    photo?: string | null
  }
}

const navGroups: NavGroup[] = [
  {
    items: [
      { href: '/admin', label: 'Dashboard', icon: IconLayoutDashboard },
    ],
  },
  {
    label: 'Produk',
    icon: IconPackage,
    items: [
      { href: '/admin/kategori', label: 'Kategori', icon: IconCategory },
      { href: '/admin/produk', label: 'Produk', icon: IconPackage },
    ],
  },
  {
    label: 'Layanan',
    icon: IconTool,
    items: [
      { href: '/admin/kategori-layanan', label: 'Kategori Layanan', icon: IconCategory },
      { href: '/admin/layanan', label: 'Layanan', icon: IconTool },
    ],
  },
  {
    label: 'Konten',
    icon: IconPhoto,
    items: [
      { href: '/admin/hero', label: 'Hero', icon: IconPhoto },
      { href: '/admin/promo', label: 'Promo', icon: IconBell },
      { href: '/admin/social-media', label: 'Sosial Media', icon: IconShare },
    ],
  },
  {
    items: [
      { href: '/admin/pesan', label: 'Pesan', icon: IconArticle },
    ],
  },
  {
    label: 'Pengaturan',
    icon: IconSettings,
    items: [
      { href: '/admin/site', label: 'Situs', icon: IconWorldWww },
      { href: '/admin/pengaturan', label: 'Profil', icon: IconMotorbike },
      { href: '/admin/akun', label: 'Akun', icon: IconUser },
    ],
  },
]

export function AdminSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set())

  useEffect(() => {
    const expanded = new Set<number>()
    navGroups.forEach((group, index) => {
      if (group.items.some((item) => pathname.startsWith(item.href))) {
        expanded.add(index)
      }
    })
    setExpandedGroups(expanded)
  }, [pathname])

  const toggleGroup = (index: number) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-surface flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-8">
        <Link href="/admin">
          <h1 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-md)] font-bold text-primary uppercase tracking-wider">
            STEED ADMIN
          </h1>
          <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-secondary mt-1 uppercase">
            CMS Bengkel
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
        {navGroups.map((group, groupIndex) => {
          const GroupIcon = group.icon
          const isExpanded = expandedGroups.has(groupIndex)

          if (!group.label) {
            return (
              <div key={groupIndex} className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-4 px-4 py-3 transition-colors duration-200 ${
                        active
                          ? 'text-primary font-bold border-r-2 border-primary bg-surface-container-high'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-[var(--font-body-md)] text-[var(--font-size-body-md)]">
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )
          }

          const groupHasActive = group.items.some((item) => isActive(item.href))

          return (
            <div key={groupIndex} className="space-y-1">
              <button
                onClick={() => toggleGroup(groupIndex)}
                className={`w-full flex items-center gap-4 px-4 py-3 transition-colors duration-200 text-left ${
                  groupHasActive
                    ? 'text-primary font-bold'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'
                }`}
              >
                {GroupIcon && <GroupIcon size={16} />}
                <span className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] uppercase tracking-wider flex-1">
                  {group.label}
                </span>
                <IconChevronDown
                  size={16}
                  className={'transition-transform duration-200 ' + (isExpanded ? 'rotate-180' : '')}
                />
              </button>

              {isExpanded && (
                <div className="ml-2 space-y-1 border-l border-outline-variant/50 pl-2">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 ${
                          active
                            ? 'text-primary font-bold border-l-2 border-primary bg-surface-container-high ml-[-10px] pl-[14px]'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="font-[var(--font-body-md)] text-[var(--font-size-body-md)]">
                          {item.label}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div className="px-6 py-4 border-t border-outline-variant">
        <div className="flex items-center gap-3 mb-4">
          {user?.photo ? (
            <Image
              src={user.photo}
              alt={user.name || 'Admin'}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border border-outline-variant"
            />
          ) : (
            <div className="w-10 h-10 bg-surface-elevated border border-outline-variant flex items-center justify-center">
              <span className="text-primary font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          )}
          <div>
            <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-primary font-bold uppercase">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-[10px] text-text-secondary uppercase">
              Online
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-primary hover:bg-surface-elevated transition-colors font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] uppercase"
        >
          <IconLogout size={18} />
          Keluar
        </button>
      </div>
    </aside>
  )
}

import Link from 'next/link'
import { IconPackage, IconTool, IconArticle, IconBrandWhatsapp, IconArrowRight } from '@tabler/icons-react'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ContactMessage } from '@/types/database.types'

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()

  // Fetch counts
  const [
    { count: productCount },
    { count: serviceCount },
    { count: messageCount },
    { count: unreadCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ])

  // Fetch recent messages
  const { data: recentMessages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5) as { data: ContactMessage[] | null }

  return (
    <div className="space-y-[var(--spacing-gutter)]">
      {/* Header */}
      <div className="relative overflow-hidden mb-12 py-8">
        <h2 className="font-[var(--font-display-ghost)] text-[var(--font-size-display-ghost)] text-white/5 absolute -bottom-4 -left-1 pointer-events-none select-none">
          OPERATIONS
        </h2>
        <div className="relative z-10">
          <h3 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] text-text-primary">
            Ringkasan Dashboard
          </h3>
          <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary tracking-[0.3em] uppercase">
            Status: Performa Optimal
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[var(--spacing-gutter)]">
        {/* Products */}
        <div className="bg-surface-card border border-outline-variant p-6 relative group hover:border-primary transition-colors duration-500">
          <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase tracking-widest">
            Total Produk
          </p>
          <h4 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] mt-2 group-hover:text-primary transition-colors">
            {productCount || 0}
          </h4>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-[var(--font-label-technical)] text-[10px] text-whatsapp-green">
              Listing Aktif
            </span>
            <IconPackage size={20} className="text-text-muted" />
          </div>
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-700" />
        </div>

        {/* Services */}
        <div className="bg-surface-card border border-outline-variant p-6 relative group hover:border-primary transition-colors duration-500">
          <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase tracking-widest">
            Layanan Aktif
          </p>
          <h4 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] mt-2 group-hover:text-primary transition-colors">
            {serviceCount || 0}
          </h4>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-[var(--font-label-technical)] text-[10px] text-text-muted">
              Tersedia
            </span>
            <IconTool size={20} className="text-text-muted" />
          </div>
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-700" />
        </div>

        {/* WhatsApp Leads */}
        <div className="bg-surface-card border border-outline-variant p-6 relative group hover:border-primary transition-colors duration-500">
          <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase tracking-widest">
            Leads WhatsApp
          </p>
          <h4 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] mt-2 group-hover:text-primary transition-colors">
            {messageCount || 0}
          </h4>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-[var(--font-label-technical)] text-[10px] text-whatsapp-green">
              Engagement Tinggi
            </span>
            <IconBrandWhatsapp size={20} className="text-whatsapp-green" />
          </div>
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-700" />
        </div>

        {/* Unread Messages */}
        <div className="bg-surface-card border border-outline-variant p-6 relative group hover:border-primary transition-colors duration-500">
          <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase tracking-widest">
            Pesan Belum Dibaca
          </p>
          <h4 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] mt-2 group-hover:text-primary transition-colors">
            {unreadCount || 0}
          </h4>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-[var(--font-label-technical)] text-[10px] text-accent-red">
              Perlu Ditinjau
            </span>
            <IconArticle size={20} className="text-text-muted" />
          </div>
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-700" />
        </div>
      </section>

      {/* Recent Messages */}
      <section className="bg-surface-card border border-outline-variant">
        <div className="p-8 border-b border-outline-variant flex justify-between items-center">
          <div>
            <h5 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-md)] uppercase">
              Pesan Terbaru
            </h5>
            <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase tracking-widest">
                Inkuiri pelanggan terbaru
            </p>
          </div>
          <Link
            href="/admin/pesan"
            className="text-primary font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] uppercase hover:underline flex items-center gap-2"
          >
            Lihat Semua <IconArrowRight size={16} />
          </Link>
        </div>
        <div className="divide-y divide-outline-variant/30">
          {recentMessages && recentMessages.length > 0 ? (
            recentMessages.map((message) => (
              <div key={message.id} className="px-8 py-4 hover:bg-surface-elevated transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-container-high flex items-center justify-center font-bold text-primary border border-outline-variant text-sm">
                      {message.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-[var(--font-body-md)] text-[var(--font-size-body-md)] text-text-primary">
                        {message.name}
                      </p>
                      <p className="font-[var(--font-body-md)] text-[var(--font-size-body-md)] text-text-secondary line-clamp-1">
                        {message.subject || message.message}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted">
                      {new Date(message.created_at ?? '').toLocaleDateString('id-ID', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {!message.is_read && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-primary-container text-on-primary-container text-[10px] font-bold uppercase">
                        Baru
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-8 py-12 text-center text-text-muted">
              Belum ada pesan
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

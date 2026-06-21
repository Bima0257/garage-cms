import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminSidebar, AdminHeader } from '@/components/admin'
import { PageLoader } from '@/components/PageLoader'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session.id) {
    redirect('/admin/login')
  }

  const supabase = createAdminClient()
  const { count: unreadCount } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  return (
    <div className="min-h-screen bg-background">
      <PageLoader />
      {/* Sidebar */}
      <AdminSidebar user={{ name: session.name, photo: session.photo }} />

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <AdminHeader unreadCount={unreadCount ?? 0} />

        {/* Page Content */}
        <div className="pt-24 pb-12 px-[var(--spacing-margin-desktop)]">
          {children}
        </div>
      </main>
    </div>
  )
}

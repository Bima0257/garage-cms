import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AdminSidebar, AdminHeader } from '@/components/admin'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar user={session.user} />

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <div className="pt-24 pb-12 px-[var(--spacing-margin-desktop)]">
          {children}
        </div>
      </main>
    </div>
  )
}

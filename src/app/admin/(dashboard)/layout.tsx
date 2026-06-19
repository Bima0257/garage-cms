import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getToken } from 'next-auth/jwt'
import { AdminSidebar, AdminHeader } from '@/components/admin'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = await getToken({
    req: { headers: { cookie: cookieStore.toString() } },
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    secureCookie: true,
  })

  if (!token) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar user={token} />

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

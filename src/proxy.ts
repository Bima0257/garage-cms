import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  let isLoggedIn = false
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })
    isLoggedIn = !!token
  } catch {
    // Auth check failure, treat as not logged in
  }

  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  // Skip protection for API routes
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Login page: redirect to dashboard if already logged in, otherwise allow
  if (isLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl.origin))
    }
    return NextResponse.next()
  }

  // Protect other admin routes
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL('/admin/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
}

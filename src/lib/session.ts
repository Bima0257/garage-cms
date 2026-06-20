import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import type { IronSession } from 'iron-session'

export interface SessionData {
  id: number
  name: string
  username: string
  email: string | null
  photo: string | null
}

export type Session = IronSession<SessionData>

const sessionOptions = {
  password: process.env.SESSION_SECRET ?? process.env.AUTH_SECRET ?? '',
  cookieName: 'admin-session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  },
}

export async function getSession(): Promise<Session> {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

export async function requireAuth(): Promise<SessionData | null> {
  const session = await getSession()
  if (!session.id) return null
  return {
    id: session.id,
    name: session.name,
    username: session.username,
    email: session.email,
    photo: session.photo,
  }
}

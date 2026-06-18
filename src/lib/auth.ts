import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { createAdminClient } from '@/lib/supabase/admin'
import { comparePassword } from '@/lib/validations/user'
import type { User } from '@/types/database.types'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      name: string
      username: string
      email: string | null
      photo: string | null
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const adminClient = createAdminClient()

        const { data: users, error } = await adminClient
          .from('users')
          .select('*')
          .eq('username', credentials.username as string)
          .single() as unknown as { data: User | null; error: unknown }

        if (error || !users) {
          return null
        }

        const user = users
        const isValidPassword = await comparePassword(
          credentials.password as string,
          user.password
        )

        if (!isValidPassword) {
          return null
        }

        // Update last login
        await adminClient
          .from('users')
          .update({ last_login_at: new Date().toISOString() } as never)
          .eq('id', user.id)

        return {
          id: user.id.toString(),
          name: user.name,
          username: user.username,
          email: user.email,
          photo: user.photo,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as unknown as User).username
        token.photo = (user as unknown as User).photo
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: number }).id = parseInt(token.id as string)
        session.user.username = token.username as string
        session.user.photo = token.photo as string | null
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
})

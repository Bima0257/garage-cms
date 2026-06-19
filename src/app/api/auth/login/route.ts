import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { comparePassword } from '@/lib/validations/user'
import { getSession } from '@/lib/session'
import type { User } from '@/types/database.types'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password wajib diisi' },
        { status: 400 },
      )
    }

    const adminClient = createAdminClient()
    const { data: users, error } = await adminClient
      .from('users')
      .select('*')
      .eq('username', username)
      .single() as unknown as { data: User | null; error: unknown }

    if (error || !users) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 },
      )
    }

    const isValid = await comparePassword(password, users.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 },
      )
    }

    // Update last login
    await adminClient
      .from('users')
      .update({ last_login_at: new Date().toISOString() } as never)
      .eq('id', users.id)

    const session = await getSession()
    session.id = users.id
    session.name = users.name
    session.username = users.username
    session.email = users.email
    session.photo = users.photo
    await session.save()

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 },
    )
  }
}

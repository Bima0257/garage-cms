import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashPassword } from '@/lib/validations/user'

export async function POST(request: Request) {
  try {
    const { username, password, name } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()
    const hashedPassword = await hashPassword(password)

    // Check if user already exists
    const { data: existing } = await adminClient
      .from('users')
      .select('id')
      .eq('username', username)
      .single() as unknown as { data: { id: number } | null }

    if (existing) {
      // Update existing user's password
      const { error } = await adminClient
        .from('users')
        .update({ password: hashedPassword } as never)
        .eq('id', existing.id)

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: `Password updated for user "${username}"`,
      })
    }

    // Create new user
    const { error } = await adminClient
      .from('users')
      .insert([{
        name: name || 'Admin User',
        username,
        password: hashedPassword,
      }] as never)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `User "${username}" created successfully`,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed admin user' },
      { status: 500 }
    )
  }
}

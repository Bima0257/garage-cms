import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashPassword } from '@/lib/validations/user'

export async function POST() {
  try {
    const adminClient = createAdminClient()

    // Seed users
    const users = [
      {
        name: 'Administrator',
        username: 'admin',
        email: 'admin@07garage.com',
        password: await hashPassword('admin123'),
        photo: null,
      },
      {
        name: 'Bima Ardiansyah',
        username: 'bima',
        email: 'bima@07garage.com',
        password: await hashPassword('bima123'),
        photo: null,
      },
      {
        name: 'Rina Wijaya',
        username: 'rina',
        email: 'rina@07garage.com',
        password: await hashPassword('rina123'),
        photo: null,
      },
      {
        name: 'Dimas Pratama',
        username: 'dimas',
        email: 'dimas@07garage.com',
        password: await hashPassword('dimas123'),
        photo: null,
      },
      {
        name: 'Sari Dewi',
        username: 'sari',
        email: 'sari@07garage.com',
        password: await hashPassword('sari123'),
        photo: null,
      },
    ]

    // Check existing users
    const { data: existingUsers } = await adminClient
      .from('users')
      .select('username') as unknown as { data: { username: string }[] | null }

    const existingUsernames = existingUsers?.map(u => u.username) || []

    // Filter out users that already exist
    const newUsers = users.filter(u => !existingUsernames.includes(u.username))

    if (newUsers.length === 0) {
      return NextResponse.json({
        message: 'All users already exist',
        users: users.map(u => ({ username: u.username, name: u.name })),
      })
    }

    // Insert new users
    const { data, error } = await adminClient
      .from('users')
      .insert(newUsers as never)
      .select() as unknown as { data: { id: number; username: string; name: string }[] | null; error: unknown }

    if (error || !data) throw error || new Error('No data returned')

    return NextResponse.json({
      message: `Successfully seeded ${data.length} user(s)`,
      users: data.map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
      })),
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed users' },
      { status: 500 }
    )
  }
}

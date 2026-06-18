import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { heroSchema } from '@/lib/validations/hero'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('heroes')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch heroes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = heroSchema.parse(body)

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('heroes')
      .insert([validated] as never)
      .select()

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin/hero')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create hero' }, { status: 500 })
  }
}

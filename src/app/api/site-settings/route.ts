import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { siteSettingsSchema } from '@/lib/validations/site-settings'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('settings')
      .select('*')
      .limit(1)
      .single() as { data: Record<string, unknown> | null; error: unknown }

    if (error && error.constructor?.name !== 'PostgresError') throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const validated = siteSettingsSchema.parse(body)

    const adminClient = createAdminClient()

    const { data: existing } = await adminClient
      .from('settings')
      .select('id')
      .limit(1)
      .single() as { data: { id: number } | null; error: unknown }

    let error
    if (existing) {
      const result = await adminClient
        .from('settings')
        .update(validated as never)
        .eq('id', existing.id)
        .select()
      error = result.error
    } else {
      const result = await adminClient
        .from('settings')
        .insert([validated] as never)
        .select()
      error = result.error
    }

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin/site')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

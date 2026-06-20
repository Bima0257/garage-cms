import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { socialMediaSchema } from '@/lib/validations/social-media'
import { requireAuth } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('social_media')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch social media' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validated = socialMediaSchema.parse(body)

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('social_media')
      .insert([validated] as never)
      .select()

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin/social-media')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create social media' }, { status: 500 })
  }
}

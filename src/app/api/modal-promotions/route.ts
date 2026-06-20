import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { modalPromotionSchema } from '@/lib/validations/modal-promotion'
import { requireAuth } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('modal_promotions')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validated = modalPromotionSchema.parse(body)

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('modal_promotions')
      .insert([validated] as never)
      .select()

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin/promo')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 })
  }
}

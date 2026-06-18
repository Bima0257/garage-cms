import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { serviceCategorySchema } from '@/lib/validations/service-category'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('service_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch service categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = serviceCategorySchema.parse(body)

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('service_categories')
      .insert([validated] as never)
      .select()

    if (error) throw error

    revalidatePath('/admin/layanan')
    revalidatePath('/admin/kategori-layanan')
    revalidatePath('/layanan')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create service category' }, { status: 500 })
  }
}

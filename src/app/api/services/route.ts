import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { serviceSchema } from '@/lib/validations/service'
import { requireAuth } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  try {
    if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validated = serviceSchema.parse(body)

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('services')
      .insert([validated] as never)
      .select()

    if (error) throw error

    revalidatePath('/admin/layanan')
    revalidatePath('/layanan')
    revalidatePath('/')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { serviceSchema } from '@/lib/validations/service'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = serviceSchema.partial().parse(body)

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('services')
      .update(validated as never)
      .eq('id', parseInt(id))
      .select()

    if (error) throw error

    revalidatePath('/admin/layanan')
    revalidatePath('/layanan')
    revalidatePath('/')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('services')
      .delete()
      .eq('id', parseInt(id))

    if (error) throw error

    revalidatePath('/admin/layanan')
    revalidatePath('/layanan')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}

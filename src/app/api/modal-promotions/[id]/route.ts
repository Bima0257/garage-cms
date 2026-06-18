import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { modalPromotionSchema } from '@/lib/validations/modal-promotion'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = modalPromotionSchema.partial().parse(body)

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('modal_promotions')
      .update(validated as never)
      .eq('id', parseInt(id))
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 })
    }

    revalidatePath('/')
    revalidatePath('/admin/promo')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 })
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
      .from('modal_promotions')
      .delete()
      .eq('id', parseInt(id))

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin/promo')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { baseProductSchema } from '@/lib/validations/product'
import { requireAuth } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const body = await request.json()
    const validated = baseProductSchema.partial().parse(body)

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('products')
      .update(validated as never)
      .eq('id', parseInt(id))
      .select()

    if (error) throw error

    revalidatePath('/admin/produk')
    revalidatePath('/produk')
    revalidatePath('/')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('products')
      .delete()
      .eq('id', parseInt(id))

    if (error) throw error

    revalidatePath('/admin/produk')
    revalidatePath('/produk')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

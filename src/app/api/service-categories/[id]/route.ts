import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { serviceCategorySchema } from '@/lib/validations/service-category'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = serviceCategorySchema.partial().parse(body)

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('service_categories')
      .update(validated as never)
      .eq('id', parseInt(id))
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    revalidatePath('/admin/layanan')
    revalidatePath('/admin/kategori-layanan')
    revalidatePath('/layanan')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update service category' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const adminClient = createAdminClient()

    const { data: services } = await adminClient
      .from('services')
      .select('id')
      .eq('category_id', parseInt(id))
      .limit(1)

    if (services && services.length > 0) {
      return NextResponse.json({
        error: 'Cannot delete category. It is being used by existing services. Please reassign or delete the services first.'
      }, { status: 400 })
    }

    const { error } = await adminClient
      .from('service_categories')
      .delete()
      .eq('id', parseInt(id))

    if (error) throw error

    revalidatePath('/admin/layanan')
    revalidatePath('/admin/kategori-layanan')
    revalidatePath('/layanan')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to delete service category' }, { status: 500 })
  }
}

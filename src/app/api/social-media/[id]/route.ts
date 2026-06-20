import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { socialMediaSchema } from '@/lib/validations/social-media'
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
    const validated = socialMediaSchema.partial().parse(body)

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('social_media')
      .update(validated as never)
      .eq('id', parseInt(id))
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Social media not found' }, { status: 404 })
    }

    revalidatePath('/')
    revalidatePath('/admin/social-media')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update social media' }, { status: 500 })
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
      .from('social_media')
      .delete()
      .eq('id', parseInt(id))

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin/social-media')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to delete social media' }, { status: 500 })
  }
}

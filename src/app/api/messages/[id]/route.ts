import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('contact_messages')
      .delete()
      .eq('id', parseInt(id))

    if (error) throw error

    revalidatePath('/admin/pesan')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}

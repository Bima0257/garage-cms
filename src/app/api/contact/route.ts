import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { contactMessageSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate data
    const validatedData = contactMessageSchema.parse(body)

    // Insert into database
    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('contact_messages')
      .insert([validatedData] as never)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Gagal mengirim pesan' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Pesan berhasil dikirim' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Data tidak valid' },
      { status: 400 }
    )
  }
}

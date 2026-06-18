import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.' }, { status: 400 })
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const adminClient = createAdminClient()
    const { data, error } = await adminClient.storage
      .from('media')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Storage error:', error)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = adminClient.storage
      .from('media')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

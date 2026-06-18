import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { productSchema } from '@/lib/validations/product'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = productSchema.parse(body)

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('products')
      .insert([validated] as never)
      .select()

    if (error) throw error

    revalidatePath('/admin/produk')
    revalidatePath('/produk')
    revalidatePath('/')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

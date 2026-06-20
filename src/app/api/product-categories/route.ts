import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { productCategorySchema } from '@/lib/validations/product-category'
import { requireAuth } from '@/lib/session'
import { revalidatePath } from 'next/cache'

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function GET() {
  try {
    if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('product_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validated = productCategorySchema.parse(body)

    // Auto-generate slug from name if not provided
    if (!validated.slug && validated.name) {
      validated.slug = generateSlug(validated.name)
    }

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('product_categories')
      .insert([validated] as never)
      .select()

    if (error) {
      // Handle duplicate slug error
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Slug already exists. Please use a different name.' }, { status: 400 })
      }
      throw error
    }

    revalidatePath('/admin/produk')
    revalidatePath('/admin/kategori')
    revalidatePath('/produk')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

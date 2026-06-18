import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { productCategorySchema } from '@/lib/validations/product-category'
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = productCategorySchema.partial().parse(body)

    // Auto-generate slug from name if name changed but slug not provided
    if (validated.name && !validated.slug) {
      validated.slug = generateSlug(validated.name)
    }

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('product_categories')
      .update(validated as never)
      .eq('id', parseInt(id))
      .select()

    if (error) {
      // Handle duplicate slug error
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Slug already exists. Please use a different name.' }, { status: 400 })
      }
      throw error
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    revalidatePath('/admin/produk')
    revalidatePath('/admin/kategori')
    revalidatePath('/produk')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const adminClient = createAdminClient()

    // Check if category is being used by any products
    const { data: products } = await adminClient
      .from('products')
      .select('id')
      .eq('category_id', parseInt(id))
      .limit(1)

    if (products && products.length > 0) {
      return NextResponse.json({
        error: 'Cannot delete category. It is being used by existing products. Please reassign or delete the products first.'
      }, { status: 400 })
    }

    const { error } = await adminClient
      .from('product_categories')
      .delete()
      .eq('id', parseInt(id))

    if (error) throw error

    revalidatePath('/admin/produk')
    revalidatePath('/admin/kategori')
    revalidatePath('/produk')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}

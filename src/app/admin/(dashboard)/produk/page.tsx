import { createClient } from '@/lib/supabase/server'
import { ProductsClient } from '@/components/admin/ProductsClient'

export default async function ProductsPage() {
  const supabase = await createClient()

  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ])

  return (
    <ProductsClient
      initialProducts={productsResult.data || []}
      categories={categoriesResult.data || []}
    />
  )
}

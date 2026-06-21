import { createClient } from '@/lib/supabase/server'
import { ProductCategoriesClient } from '@/components/admin/ProductCategoriesClient'
import type { Product } from '@/types/database.types'

export default async function ProductCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  const { data: allProducts } = await supabase
    .from('products')
    .select('category_id')
    .returns<Pick<Product, 'category_id'>[]>()

  const productCountMap: Record<number, number> = {}
  if (allProducts) {
    for (const p of allProducts) {
      if (p.category_id !== null) {
        productCountMap[p.category_id] = (productCountMap[p.category_id] || 0) + 1
      }
    }
  }

  return (
    <ProductCategoriesClient
      initialCategories={categories || []}
      productCountMap={productCountMap}
    />
  )
}

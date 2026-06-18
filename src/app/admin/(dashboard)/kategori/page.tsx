import { createClient } from '@/lib/supabase/server'
import { ProductCategoriesClient } from '@/components/admin/ProductCategoriesClient'

export default async function ProductCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <ProductCategoriesClient initialCategories={categories || []} />
  )
}

import { createClient } from '@/lib/supabase/server'
import { ServiceCategoriesClient } from '@/components/admin/ServiceCategoriesClient'

export default async function ServiceCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <ServiceCategoriesClient initialCategories={categories || []} />
  )
}

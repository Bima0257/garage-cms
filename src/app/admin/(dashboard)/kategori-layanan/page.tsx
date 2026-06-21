import { createClient } from '@/lib/supabase/server'
import { ServiceCategoriesClient } from '@/components/admin/ServiceCategoriesClient'
import type { Service } from '@/types/database.types'

export default async function ServiceCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  const { data: allServices } = await supabase
    .from('services')
    .select('category_id')
    .returns<Pick<Service, 'category_id'>[]>()

  const serviceCountMap: Record<number, number> = {}
  if (allServices) {
    for (const s of allServices) {
      if (s.category_id !== null) {
        serviceCountMap[s.category_id] = (serviceCountMap[s.category_id] || 0) + 1
      }
    }
  }

  return (
    <ServiceCategoriesClient
      initialCategories={categories || []}
      serviceCountMap={serviceCountMap}
    />
  )
}

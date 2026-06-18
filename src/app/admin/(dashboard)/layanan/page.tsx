import { createClient } from '@/lib/supabase/server'
import { ServicesClient } from '@/components/admin/ServicesClient'

export default async function ServicesPage() {
  const supabase = await createClient()

  const [servicesResult, categoriesResult] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ])

  return (
    <ServicesClient
      initialServices={servicesResult.data || []}
      categories={categoriesResult.data || []}
    />
  )
}

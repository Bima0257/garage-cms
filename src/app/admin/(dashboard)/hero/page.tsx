import { createClient } from '@/lib/supabase/server'
import { HeroesClient } from '@/components/admin/HeroesClient'

export default async function HeroesPage() {
  const supabase = await createClient()

  const { data: heroes } = await supabase
    .from('heroes')
    .select('*')
    .order('sort_order', { ascending: true })

  return <HeroesClient initialHeroes={heroes || []} />
}

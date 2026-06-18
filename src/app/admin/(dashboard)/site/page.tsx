import { createClient } from '@/lib/supabase/server'
import { SiteSettingsClient } from '@/components/admin/SiteSettingsClient'
import type { Settings } from '@/types/database.types'

export default async function SiteSettingsPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single() as { data: Settings | null }

  return <SiteSettingsClient settings={settings} />
}

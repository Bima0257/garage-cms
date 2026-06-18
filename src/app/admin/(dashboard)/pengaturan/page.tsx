import { createClient } from '@/lib/supabase/server'
import { SettingsClient } from '@/components/admin/SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: about } = await supabase
    .from('abouts')
    .select('*')
    .limit(1)
    .single()

  return <SettingsClient about={about} />
}

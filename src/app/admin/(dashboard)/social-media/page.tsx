import { createClient } from '@/lib/supabase/server'
import { SocialMediaClient } from '@/components/admin/SocialMediaClient'

export default async function SocialMediaPage() {
  const supabase = await createClient()

  const { data: socialMedia } = await supabase
    .from('social_media')
    .select('*')
    .order('sort_order', { ascending: true })

  return <SocialMediaClient initialSocialMedia={socialMedia || []} />
}

import { createAdminClient } from '@/lib/supabase/admin'
import { MessagesClient } from '@/components/admin/MessagesClient'

export default async function MessagesPage() {
  const supabase = createAdminClient()

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  return <MessagesClient initialMessages={messages || []} />
}

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

// Admin client with service role - ONLY used in Server Actions
// Never expose this to the client
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

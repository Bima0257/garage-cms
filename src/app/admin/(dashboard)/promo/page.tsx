import { createClient } from '@/lib/supabase/server'
import { ModalPromotionsClient } from '@/components/admin/ModalPromotionsClient'

export default async function PromoPage() {
  const supabase = await createClient()

  const { data: promotions } = await supabase
    .from('modal_promotions')
    .select('*')
    .order('start_date', { ascending: false })

  return <ModalPromotionsClient initialPromotions={promotions || []} />
}

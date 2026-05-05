import { PageShell } from '@/components/PageShell'
import { ShopPageClient } from '@/components/commerce/ShopPageClient'
import { createClient } from '@/utils/supabase/server'
import type { Product } from '@/types/product'

export const metadata = {
  title: 'Shop Gift Hampers | Aus Gift Hampers',
  description: 'Shop new arrivals, collections, sale products, and premium gift hampers with advanced filters.',
}

export default async function ShopPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <PageShell
      eyebrow="Shop"
      title="Premium Hampers, Fully Curated"
      description="Filter by category, price, popularity, and new arrivals. Your cart and wishlist stay synced everywhere."
    >
      <ShopPageClient products={(data || []) as Product[]} />
    </PageShell>
  )
}

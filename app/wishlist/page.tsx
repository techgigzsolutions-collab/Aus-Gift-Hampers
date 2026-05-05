import { WishlistPageClient } from '@/components/commerce/WishlistPageClient'
import { PageShell } from '@/components/PageShell'
import { createClient } from '@/utils/supabase/server'
import type { Product } from '@/types/product'

export const metadata = {
  title: 'Wishlist | Aus Gift Hampers',
  description: 'View and manage your saved premium gift hampers.',
}

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <PageShell eyebrow="Saved" title="Wishlist" description="Your saved hampers stay synced across the storefront.">
      <WishlistPageClient products={(data || []) as Product[]} />
    </PageShell>
  )
}

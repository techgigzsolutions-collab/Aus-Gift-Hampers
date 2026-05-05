import { CartPageClient } from '@/components/commerce/CartPageClient'
import { PageShell } from '@/components/PageShell'
import { createClient } from '@/utils/supabase/server'
import type { Product } from '@/types/product'

export const metadata = {
  title: 'Cart | Aus Gift Hampers',
  description: 'Review your selected Aus Gift Hampers products before checkout.',
}

export default async function CartPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <PageShell eyebrow="Checkout" title="Your Cart" description="Adjust quantities, remove items, and review your order total.">
      <CartPageClient products={(data || []) as Product[]} />
    </PageShell>
  )
}

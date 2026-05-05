import { ShopExperience } from '@/components/ShopExperience'
import { createClient } from '@/utils/supabase/server'
import type { Product } from '@/types/product'

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return <ShopExperience products={(data || []) as Product[]} />
}

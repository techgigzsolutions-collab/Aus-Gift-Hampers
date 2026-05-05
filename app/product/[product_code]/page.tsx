import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { SiteFooter } from '@/components/SiteFooter'
import { ProductPageClient } from '@/components/product/ProductPageClient'
import { createClient } from '@/utils/supabase/server'
import type { Product } from '@/types/product'

interface ProductRouteProps {
  params: Promise<{ product_code: string }>
}

export async function generateMetadata({ params }: ProductRouteProps) {
  const { product_code } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name, description')
    .eq('product_code', decodeURIComponent(product_code))
    .maybeSingle()

  if (!data) {
    return {
      title: 'Product Not Found | Aus Gift Hampers',
    }
  }

  return {
    title: `${data.name} | Aus Gift Hampers`,
    description: data.description,
  }
}

export default async function ProductPage({ params }: ProductRouteProps) {
  const { product_code } = await params
  const supabase = await createClient()

  const { data: productData } = await supabase
    .from('products')
    .select('*')
    .eq('product_code', decodeURIComponent(product_code))
    .maybeSingle()

  if (!productData) notFound()

  const product = productData as Product

  const { data: relatedData } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('product_code', product.product_code)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <main className="min-h-screen bg-[#f8f6f3] text-foreground">
      <Navbar forceSolid />
      <ProductPageClient product={product} relatedProducts={(relatedData || []) as Product[]} />
      <SiteFooter />
    </main>
  )
}

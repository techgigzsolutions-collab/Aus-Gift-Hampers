'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { HeroSlider } from '@/components/HeroSlider'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { AllProducts } from '@/components/AllProducts'
import { ScrollProgress } from '@/components/ScrollProgress'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { useCommerce } from '@/components/commerce/CommerceProvider'
import type { Product } from '@/types/product'
import { FinalCtaScene, SolutionScene, TrustScene } from '@/components/StoryScenes'
import { SiteFooter } from '@/components/SiteFooter'

interface ShopExperienceProps {
  products: Product[]
}

export function ShopExperience({ products }: ShopExperienceProps) {
  const commerce = useCommerce()

  const featuredProducts = products.filter(p => p.featured).slice(0, 4)
  const signatureProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)

  useEffect(() => {
    commerce.registerProducts(products)
  }, [commerce.registerProducts, products])

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace('#', '')
      if (!id) return
      window.setTimeout(() => {
        const element = document.getElementById(id)
        if (!element) return
        const top = element.getBoundingClientRect().top + window.scrollY - 76
        window.scrollTo({ top, behavior: 'smooth' })
      }, 120)
    }
    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])

  // Build CartItem[] from live commerce cart so WhatsAppButton
  // always reflects the current cart state (region included at click-time).
  const cartItems = commerce.cart
    .map(item => {
      const product = products.find(
        p => p.id === item.productId || p.product_code === item.productId,
      )
      if (!product) return null
      return {
        id: product.id,
        product_code: product.product_code,
        name: product.name,
        price: product.discounted_price ?? product.price,
        quantity: item.qty,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  return (
    <main className="bg-white text-foreground">
      <ScrollProgress />
      <Navbar />
      <div id="hero">
        <HeroSlider />
      </div>
      <SolutionScene />
      <div id="featured">
        <FeaturedProducts products={signatureProducts} />
      </div>
      <AllProducts products={products} />
      <TrustScene />
      <FinalCtaScene />

      {/*
        WhatsAppButton is the single canonical floating CTA.
        - Uses <a href> (no window.open) → works on iOS Safari
        - No target="_blank" → same-frame navigation, never blocked
        - Message built at render from cartItems + location from localStorage
        - When cart is empty shows general enquiry message
      */}
      <WhatsAppButton cartItems={cartItems} />

      <SiteFooter />
    </main>
  )
}

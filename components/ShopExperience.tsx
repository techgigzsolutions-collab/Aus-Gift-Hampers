'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { HeroSlider } from '@/components/HeroSlider'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { AllProducts } from '@/components/AllProducts'
import { ScrollProgress } from '@/components/ScrollProgress'
import { useCommerce } from '@/components/commerce/CommerceProvider'
import type { Product } from '@/types/product'
import { getWhatsAppHref } from '@/lib/whatsapp'
import { FinalCtaScene, SolutionScene, TrustScene } from '@/components/StoryScenes'
import { SiteFooter } from '@/components/SiteFooter'

interface ShopExperienceProps {
  products: Product[]
}

export function ShopExperience({ products }: ShopExperienceProps) {
  const commerce = useCommerce()
  const featuredProducts = products.filter(product => product.featured).slice(0, 4)
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

        const navbarOffset = 76
        const top = element.getBoundingClientRect().top + window.scrollY - navbarOffset
        window.scrollTo({ top, behavior: 'smooth' })
      }, 120)
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)

    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])

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

      <a
        href={getWhatsAppHref("Hi, I'd like to ask about Aus Gift Hampers.")}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float fixed bottom-6 right-6 z-40 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_38px_rgba(37,211,102,0.38)] transition-transform duration-300 hover:scale-110 active:scale-95"
        aria-label="Contact us on WhatsApp"
      >
        <svg className="h-8 w-8" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16.02 3.2C9.01 3.2 3.31 8.82 3.31 15.73c0 2.2.59 4.36 1.7 6.24L3.2 28.8l7.03-1.79a12.86 12.86 0 0 0 5.79 1.42c7.01 0 12.71-5.62 12.71-12.53S23.03 3.2 16.02 3.2Zm0 22.99c-1.83 0-3.62-.49-5.18-1.42l-.37-.22-4.17 1.06 1.11-4.04-.24-.39a10.2 10.2 0 0 1-1.6-5.45c0-5.68 4.69-10.29 10.45-10.29s10.45 4.61 10.45 10.29-4.69 10.46-10.45 10.46Zm5.73-7.7c-.31-.16-1.86-.91-2.15-1.01-.29-.11-.5-.16-.71.16-.21.31-.82 1.01-1 1.21-.18.21-.37.23-.68.08-.31-.16-1.32-.48-2.52-1.54-.93-.82-1.56-1.84-1.74-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.11-.21.05-.39-.03-.55-.08-.16-.71-1.69-.97-2.31-.26-.6-.52-.52-.71-.53h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.59 0 1.53 1.13 3.01 1.29 3.22.16.21 2.23 3.36 5.39 4.71.75.32 1.34.51 1.8.65.76.24 1.44.21 1.98.13.61-.09 1.86-.75 2.12-1.48.26-.73.26-1.35.18-1.48-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </a>

      <SiteFooter />
    </main>
  )
}

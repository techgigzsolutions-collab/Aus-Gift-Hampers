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
import { MessageCircle } from 'lucide-react'
import { FinalCtaScene, SolutionScene, TrustScene } from '@/components/StoryScenes'
import { SiteFooter } from '@/components/SiteFooter'

interface ShopExperienceProps {
  products: Product[]
}

export function ShopExperience({ products }: ShopExperienceProps) {
  const commerce = useCommerce()

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
        <FeaturedProducts products={products.slice(0, 4)} />
      </div>
      <AllProducts products={products} />
      <TrustScene />
      <FinalCtaScene />

      <a
        href={getWhatsAppHref("Hi, I'd like to ask about Aus Gift Hampers.")}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-accent text-white shadow-2xl shadow-accent/30 flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      <SiteFooter />
    </main>
  )
}

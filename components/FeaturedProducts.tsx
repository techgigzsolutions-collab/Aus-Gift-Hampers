'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types/product'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCommerce } from '@/components/commerce/CommerceProvider'
import { formatCurrency } from '@/lib/currency'
import { isLowStock, productSku, productStock } from '@/lib/productIdentity'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FeaturedProductsProps {
  products: Product[]
  onProductClick?: (product: Product) => void
}

const money = formatCurrency

export function FeaturedProducts({ products, onProductClick }: FeaturedProductsProps) {
  const commerce = useCommerce()
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!sectionRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-featured-card]',
        { autoAlpha: 0, y: 48 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.095,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            once: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [products.length])

  return (
    <section ref={sectionRef} id="featured" data-motion-section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div data-motion-child className="text-center mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Featured</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 mt-2">
            Featured Signature Collections
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Handpicked selections from our premium range
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl bg-white">
            <p className="text-neutral-600">No products are published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <button
                key={productSku(product)}
                data-featured-card
                className="group text-left animate-fade-in motion-card will-change-transform"
                onClick={() => {
                  onProductClick?.(product)
                  router.push(`/product/${productSku(product)}`)
                }}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-72 rounded-xl overflow-hidden mb-6 bg-neutral-100 shadow-sm">
                  <Image
                    src={product.main_image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform"
                    data-image-scale
                    sizes="(max-width: 768px) 100vw, 25vw"
                    loading="lazy"
                  />
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={event => {
                      event.stopPropagation()
                      commerce.toggleWishlist(product)
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        event.stopPropagation()
                        commerce.toggleWishlist(product)
                      }
                    }}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur transition-colors group-hover:text-accent"
                  >
                    <Heart className={`h-4 w-4 ${commerce.isWishlisted(productSku(product)) ? 'fill-current text-accent' : ''}`} />
                  </span>
                  {isLowStock(product) && (
                    <span className="absolute bottom-4 left-4 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white">
                      Only {productStock(product)} left
                    </span>
                  )}
                  {productStock(product) === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                      <span className="font-semibold text-white">Out of Stock</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-accent uppercase tracking-wider font-semibold mb-2">
                  {product.category}
                </p>
                <p className="mb-2 text-xs font-semibold text-neutral-500">Code: {productSku(product)}</p>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-end justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-lg text-foreground">
                      {money(product.discounted_price || product.price)}
                    </span>
                    {product.discounted_price && (
                      <span className="text-sm text-neutral-400 line-through">{money(product.price)}</span>
                    )}
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={event => {
                      event.stopPropagation()
                      if (productStock(product) > 0) commerce.addToCart(product, 1)
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        event.stopPropagation()
                        if (productStock(product) > 0) commerce.addToCart(product, 1)
                      }
                    }}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                      productStock(product) === 0
                        ? 'cursor-not-allowed bg-neutral-200 text-neutral-500'
                        : commerce.isInCart(productSku(product))
                        ? 'bg-foreground text-white'
                        : 'bg-accent/10 text-accent hover:bg-accent hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {productStock(product) === 0 ? 'Out' : commerce.isInCart(productSku(product)) ? 'Added' : 'Add'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold rounded-lg transition-all"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  )
}

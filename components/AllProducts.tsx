'use client'

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Heart, Search, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types/product'
import { useCommerce } from '@/components/commerce/CommerceProvider'
import { isLowStock, productSku, productStock } from '@/lib/productIdentity'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(Flip, ScrollTrigger)

interface FilterState {
  category: string
  search: string
  sort: 'name-asc' | 'price-asc' | 'price-desc'
}

interface AllProductsProps {
  products: Product[]
  onProductClick?: (product: Product) => void
}

const money = (value: number) => `₹${Number(value).toLocaleString('en-IN')}`
const displayPrice = (product: Product) => product.discounted_price || product.price

export function AllProducts({ products, onProductClick }: AllProductsProps) {
  const commerce = useCommerce()
  const router = useRouter()
  const gridRef = useRef<HTMLDivElement>(null)
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    search: '',
    sort: 'name-asc',
  })

  const categories = useMemo(() => ['all', ...new Set(products.map(p => p.category))], [products])

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    if (filters.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === filters.category.toLowerCase())
    }

    if (filters.search.trim()) {
      const search = filters.search.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(search) || productSku(p).toLowerCase().includes(search))
    }

    if (filters.sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name))
    if (filters.sort === 'price-asc') result.sort((a, b) => displayPrice(a) - displayPrice(b))
    if (filters.sort === 'price-desc') result.sort((a, b) => displayPrice(b) - displayPrice(a))

    return result
  }, [filters, products])

  useLayoutEffect(() => {
    if (!gridRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-product-card]',
        { autoAlpha: 0, y: 46 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.075,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      )

      gsap.utils.toArray<HTMLElement>('[data-product-card]').forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -16 : -8,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        })
      })
    }, gridRef)

    return () => ctx.revert()
  }, [filteredAndSortedProducts.length])

  const updateFilters = (next: FilterState) => {
    const state = gridRef.current ? Flip.getState('[data-product-card]') : null
    setFilters(next)

    requestAnimationFrame(() => {
      if (!state) return
      Flip.from(state, {
        duration: 0.58,
        ease: 'power3.inOut',
        absolute: true,
        stagger: 0.025,
        onEnter: elements =>
          gsap.fromTo(elements, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.42 }),
        onLeave: elements => gsap.to(elements, { autoAlpha: 0, y: -18, duration: 0.28 }),
      })
    })
  }

  const handleTilt = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(hover: none)').matches) return
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    gsap.to(card, {
      rotateX: y * -4,
      rotateY: x * 4,
      transformPerspective: 900,
      duration: 0.35,
      ease: 'power2.out',
    })
  }

  const resetTilt = (event: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(event.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.45, ease: 'power2.out' })
  }

  return (
    <section id="products" data-motion-section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div data-motion-child className="mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            All Products
          </h2>
          <p className="text-neutral-600 text-lg">
            Explore our complete collection of luxury gift hampers
          </p>
        </div>

        <div data-motion-child className="mb-12 grid grid-cols-1 lg:grid-cols-[1fr_220px_220px] gap-4 items-end">
          <label className="block">
            <span className="block text-sm font-semibold text-foreground mb-2">Search</span>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products"
                value={filters.search}
                onChange={e => updateFilters({ ...filters, search: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-sm font-semibold text-foreground mb-2">Category</span>
            <select
              value={filters.category}
              onChange={e => updateFilters({ ...filters, category: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-accent transition-colors cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-semibold text-foreground mb-2">Sort</span>
            <select
              value={filters.sort}
              onChange={e => updateFilters({ ...filters, sort: e.target.value as FilterState['sort'] })}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-accent transition-colors cursor-pointer"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="price-asc">Price low to high</option>
              <option value="price-desc">Price high to low</option>
            </select>
          </label>
        </div>

        <p className="text-sm text-neutral-600 mb-8">
          Showing {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
        </p>

        {filteredAndSortedProducts.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProducts.map((product, index) => (
              <button
                key={productSku(product)}
                data-product-card
                className="group text-left animate-fade-in motion-card will-change-transform"
                onClick={() => {
                  onProductClick?.(product)
                  router.push(`/product/${productSku(product)}`)
                }}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-72 rounded-xl overflow-hidden mb-4 bg-neutral-100 shadow-sm">
                  <Image
                    src={product.main_image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform"
                    data-image-scale
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-foreground">
                    {product.free_shipping ? 'Free shipping' : product.category}
                  </div>
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
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-foreground group-hover:text-accent transition-colors"
                    aria-label={commerce.isWishlisted(productSku(product)) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${commerce.isWishlisted(productSku(product)) ? 'fill-current text-accent scale-110' : ''}`} />
                  </span>
                  {isLowStock(product) && (
                    <div className="absolute bottom-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Only {productStock(product)} left
                    </div>
                  )}
                  {productStock(product) === 0 && (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <p className="mb-2 text-xs font-semibold text-neutral-500">Code: {productSku(product)}</p>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-end justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-accent">{money(displayPrice(product))}</p>
                    {product.discounted_price && (
                      <p className="text-sm text-neutral-400 line-through">{money(product.price)}</p>
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
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <p className="text-neutral-600 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  )
}

'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Heart, Search, SlidersHorizontal, ShoppingBag, X } from 'lucide-react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import type { Product } from '@/types/product'
import { money, productPrice, useCommerce } from '@/components/commerce/CommerceProvider'
import { isLowStock, productSku, productStock } from '@/lib/productIdentity'

gsap.registerPlugin(Flip)

type SortOption = 'new' | 'popular' | 'price-asc' | 'price-desc'

function ShopPageInner({ products }: { products: Product[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const commerce = useCommerce()
  const gridRef = useRef<HTMLDivElement>(null)
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<SortOption>('new')
  const [search, setSearch] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [maxPrice, setMaxPrice] = useState(() => Math.max(...products.map(productPrice), 0))

  const view = searchParams.get('view')
  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(product => product.category)))], [products])
  const absoluteMaxPrice = Math.max(...products.map(productPrice), 0)

  useEffect(() => {
    commerce.registerProducts(products)
  }, [commerce.registerProducts, products])

  const visibleProducts = useMemo(() => {
    let result = [...products]

    if (view === 'sale') result = result.filter(product => Boolean(product.discounted_price))
    if (view === 'new-arrivals') result = result.slice(0, 8)
    if (category !== 'all') result = result.filter(product => product.category === category)
    if (search.trim()) {
      const query = search.trim().toLowerCase()
      result = result.filter(product => product.name.toLowerCase().includes(query) || productSku(product).toLowerCase().includes(query))
    }
    result = result.filter(product => productPrice(product) <= maxPrice)

    if (sort === 'new') result.sort((a, b) => Date.parse(b.created_at || '') - Date.parse(a.created_at || ''))
    if (sort === 'popular') result.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0))
    if (sort === 'price-asc') result.sort((a, b) => productPrice(a) - productPrice(b))
    if (sort === 'price-desc') result.sort((a, b) => productPrice(b) - productPrice(a))

    return result
  }, [category, maxPrice, products, search, sort, view])

  useLayoutEffect(() => {
    if (!gridRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-shop-card]',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.045, ease: 'power3.out' }
      )
    }, gridRef)

    return () => ctx.revert()
  }, [visibleProducts.length])

  const animateChange = (change: () => void) => {
    const state = gridRef.current ? Flip.getState('[data-shop-card]') : null
    change()
    requestAnimationFrame(() => {
      if (!state) return
      Flip.from(state, {
        duration: 0.5,
        ease: 'power3.inOut',
        absolute: true,
        stagger: 0.02,
        onEnter: elements => gsap.fromTo(elements, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.32 }),
        onLeave: elements => gsap.to(elements, { autoAlpha: 0, y: -14, duration: 0.24 }),
      })
    })
  }

  const filters = (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Category</p>
        <div className="space-y-2">
          {categories.map(option => (
            <button
              key={option}
              onClick={() => animateChange(() => setCategory(option))}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                category === option ? 'bg-accent text-white' : 'hover:bg-secondary'
              }`}
            >
              {option === 'all' ? 'All categories' : option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex justify-between text-sm font-semibold">
          <span>Price range</span>
          <span className="text-accent">{money(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={absoluteMaxPrice || 1}
          value={maxPrice}
          onChange={event => animateChange(() => setMaxPrice(Number(event.target.value)))}
          className="w-full accent-[hsl(var(--accent))]"
        />
      </div>
    </div>
  )

  return (
    <>
      <div className="sticky top-16 z-20 mb-8 rounded-2xl border border-border bg-white/86 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-neutral-600">{visibleProducts.length} products</p>
            <h2 className="font-serif text-2xl font-bold">
              {view === 'sale' ? 'Sale' : view === 'new-arrivals' ? 'New Arrivals' : view === 'collections' ? 'Collections' : 'Shop All'}
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative min-w-0 sm:min-w-[240px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={event => animateChange(() => setSearch(event.target.value))}
                placeholder="Search name or SKU"
                className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </label>
            <button onClick={() => setMobileFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <select
              value={sort}
              onChange={event => animateChange(() => setSort(event.target.value as SortOption))}
              className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="new">New arrivals</option>
              <option value="popular">Popular</option>
              <option value="price-asc">Price low to high</option>
              <option value="price-desc">Price high to low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden h-fit rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-36 lg:block">
          <div className="mb-6 flex items-center gap-2">
            <Filter className="h-4 w-4 text-accent" />
            <h2 className="font-serif text-2xl font-bold">Filters</h2>
          </div>
          {filters}
        </aside>

        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map(product => (
            <article key={productSku(product)} data-shop-card className="motion-card overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <button onClick={() => router.push(`/product/${productSku(product)}`)} className="group block w-full text-left">
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <Image src={product.main_image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
                  {product.discounted_price && (
                    <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">Sale</span>
                  )}
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
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={event => {
                      event.stopPropagation()
                      commerce.toggleWishlist(product)
                    }}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur"
                  >
                    <Heart className={`h-4 w-4 ${commerce.isWishlisted(productSku(product)) ? 'fill-current text-accent' : ''}`} />
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{product.category}</p>
                  <p className="mt-2 text-xs font-semibold text-neutral-500">Code: {productSku(product)}</p>
                  <h3 className="mt-2 font-serif text-2xl font-bold">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{product.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-lg font-bold text-accent">{money(productPrice(product))}</p>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={event => {
                        event.stopPropagation()
                        if (productStock(product) > 0) commerce.addToCart(product, 1)
                      }}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                        productStock(product) === 0
                          ? 'cursor-not-allowed bg-neutral-200 text-neutral-500'
                          : commerce.isInCart(productSku(product)) ? 'bg-foreground text-white' : 'bg-accent/10 text-accent'
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {productStock(product) === 0 ? 'Out' : commerce.isInCart(productSku(product)) ? 'Added' : 'Add'}
                    </span>
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      {mobileFiltersOpen && (
        <>
          <button className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" />
          <aside className="fixed bottom-0 left-0 right-0 z-[71] rounded-t-3xl bg-white p-6 shadow-2xl lg:hidden">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="rounded-full p-2 hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filters}
          </aside>
        </>
      )}

    </>
  )
}

export function ShopPageClient({ products }: { products: Product[] }) {
  return (
    <Suspense fallback={<div className="h-96 rounded-2xl bg-white/70 animate-pulse" />}>
      <ShopPageInner products={products} />
    </Suspense>
  )
}

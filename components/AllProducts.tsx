'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, Search, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types/product'
import { useCommerce } from '@/components/commerce/CommerceProvider'
import { isLowStock, productSku, productStock } from '@/lib/productIdentity'

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const PRODUCTS_PER_PAGE = 12

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const money = (value: number) => `₹${Number(value).toLocaleString('en-IN')}`
const displayPrice = (p: Product) => p.discounted_price || p.price

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type SortKey = 'name-asc' | 'price-asc' | 'price-desc'

interface AllProductsProps {
  products: Product[]
  onProductClick?: (product: Product) => void
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export function AllProducts({ products, onProductClick }: AllProductsProps) {
  const commerce = useCommerce()
  const router = useRouter()
  const sectionRef = useRef<HTMLDivElement>(null)

  // Filter / sort state
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<SortKey>('name-asc')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)

  // Reset to page 1 whenever filters/sort change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, category, sort])

  // ── Derived: all categories ──────────────────
  const categories = useMemo(
    () => ['all', ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  )

  // ── Derived: filtered + sorted products ──────
  const filtered = useMemo(() => {
    let result = [...products]

    if (category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          productSku(p).toLowerCase().includes(q)
      )
    }

    if (sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'price-asc') result.sort((a, b) => displayPrice(a) - displayPrice(b))
    if (sort === 'price-desc') result.sort((a, b) => displayPrice(b) - displayPrice(a))

    return result
  }, [products, search, category, sort])

  // ── Derived: pagination ───────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE))

  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE),
    [filtered, currentPage]
  )

  // ── Page change helper ────────────────────────
  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(p)
    // Scroll section into view smoothly
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Page number list (with ellipsis) ─────────
  const pageNumbers = useMemo(() => {
    const pages: (number | '…')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('…')
      const lo = Math.max(2, currentPage - 1)
      const hi = Math.min(totalPages - 1, currentPage + 1)
      for (let i = lo; i <= hi; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('…')
      pages.push(totalPages)
    }
    return pages
  }, [currentPage, totalPages])

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <section
      id="products"
      ref={sectionRef}
      data-motion-section
      className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-white"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Heading ── */}
        <div data-motion-child className="mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            All Products
          </h2>
          <p className="text-neutral-600 text-lg">
            Explore our complete collection of luxury gift hampers
          </p>
        </div>

        {/* ── Filter bar ── */}
        <div data-motion-child className="mb-6 flex flex-wrap items-end gap-4">

          {/* Search */}
          <label className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
            <span className="text-sm font-semibold text-foreground">Search</span>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 w-full pl-11 pr-4 border border-neutral-200 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white"
              />
            </div>
          </label>

          {/* Category */}
          <label className="flex flex-col gap-1.5 w-[190px] shrink-0">
            <span className="text-sm font-semibold text-foreground">Category</span>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="h-12 w-full px-4 border border-neutral-200 rounded-lg focus:outline-none focus:border-accent transition-colors cursor-pointer bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </label>

          {/* Sort */}
          <label className="flex flex-col gap-1.5 w-[190px] shrink-0">
            <span className="text-sm font-semibold text-foreground">Sort by</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="h-12 w-full px-4 border border-neutral-200 rounded-lg focus:outline-none focus:border-accent transition-colors cursor-pointer bg-white"
            >
              <option value="name-asc">Name A–Z</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>

        {/* ── Count ── */}
        <p className="text-sm text-neutral-500 mb-8 h-5">
          {filtered.length === 0
            ? 'No products match your filters'
            : `Showing ${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(currentPage * PRODUCTS_PER_PAGE, filtered.length)} of ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 items-start">
              {paginated.map(product => (
                <button
                  key={product.id}
                  className="group text-left w-full flex flex-col animate-card-enter"
                  onClick={() => {
                    onProductClick?.(product)
                    router.push(`/product/${productSku(product)}`)
                  }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden mb-3 bg-neutral-100 shadow-sm">
                    <Image
                      src={product.main_image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                    />
                    {/* Badge */}
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold text-foreground">
                      {product.free_shipping ? 'Free shipping' : product.category}
                    </div>
                    {/* Wishlist */}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={e => { e.stopPropagation(); commerce.toggleWishlist(product) }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault(); e.stopPropagation()
                          commerce.toggleWishlist(product)
                        }
                      }}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-foreground group-hover:text-accent transition-colors"
                      aria-label="Toggle wishlist"
                    >
                      <Heart
                        className={`w-3 sm:w-4 h-3 sm:h-4 ${
                          commerce.isWishlisted(productSku(product))
                            ? 'fill-current text-accent'
                            : ''
                        }`}
                      />
                    </span>
                    {/* Low stock */}
                    {isLowStock(product) && productStock(product) > 0 && (
                      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-orange-600 text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold">
                        Only {productStock(product)} left
                      </div>
                    )}
                    {/* Out of stock overlay */}
                    {productStock(product) === 0 && (
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                        <span className="text-white font-semibold text-xs sm:text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 flex flex-col w-full">
                    <p className="text-[10px] sm:text-xs text-accent font-semibold uppercase tracking-wider mb-0.5">
                      {product.category}
                    </p>
                    <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 mb-1">
                      {productSku(product)}
                    </p>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-foreground mb-1 sm:mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[11px] sm:text-sm text-neutral-500 line-clamp-1 mb-2 sm:mb-3">
                      {product.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-xl font-bold text-accent">
                          {money(displayPrice(product))}
                        </span>
                        {product.discounted_price && (
                          <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                            {money(product.price)}
                          </span>
                        )}
                      </div>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={e => {
                          e.stopPropagation()
                          if (productStock(product) > 0) commerce.addToCart(product, 1)
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault(); e.stopPropagation()
                            if (productStock(product) > 0) commerce.addToCart(product, 1)
                          }
                        }}
                        className={`inline-flex items-center gap-1 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold transition-all duration-200 shrink-0 ${
                          productStock(product) === 0
                            ? 'cursor-not-allowed bg-neutral-200 text-neutral-500'
                            : commerce.isInCart(productSku(product))
                            ? 'bg-foreground text-white'
                            : 'bg-accent/10 text-accent hover:bg-accent hover:text-white'
                        }`}
                      >
                        <ShoppingBag className="h-3 sm:h-4 w-3 sm:w-4" />
                        <span className="hidden sm:inline">
                          {productStock(product) === 0
                            ? 'Out'
                            : commerce.isInCart(productSku(product))
                            ? 'Added'
                            : 'Add'}
                        </span>
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* ── Pagination bar ── */}
            {totalPages > 1 && (
              <div className="mt-14 flex flex-wrap items-center justify-center gap-2">

                {/* Prev */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                {/* Page numbers */}
                {pageNumbers.map((p, i) =>
                  p === '…' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-neutral-400 select-none">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p as number)}
                      aria-current={p === currentPage ? 'page' : undefined}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                        p === currentPage
                          ? 'bg-accent text-white shadow-sm'
                          : 'border border-neutral-200 bg-white text-foreground hover:bg-neutral-50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Page indicator */}
                <span className="w-full text-center text-xs text-neutral-400 mt-1">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <p className="text-neutral-600 text-lg">No products found.</p>
            {(search || category !== 'all') && (
              <button
                onClick={() => { setSearch(''); setCategory('all') }}
                className="mt-4 text-sm text-accent underline underline-offset-4 hover:text-accent/80"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Product } from '@/types/product'
import { formatCurrency } from '@/lib/currency'
import { productSku, productStock } from '@/lib/productIdentity'

// ─────────────────────────────────────────────
const PRODUCTS_PER_PAGE = 12
// ─────────────────────────────────────────────

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onStockUpdate: (id: string, stock: number) => void
  onFeaturedUpdate: (id: string, featured: boolean) => void
}

export function ProductList({
  products,
  onEdit,
  onDelete,
  onStockUpdate,
  onFeaturedUpdate,
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [savingStockId, setSavingStockId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  // ── Categories ──────────────────────────────
  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))),
    [products]
  )

  // ── Filtered ────────────────────────────────
  const filtered = useMemo(() => {
    return products.filter(p => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        productSku(p).toLowerCase().includes(q)
      const matchesCat =
        !selectedCategory || p.category === selectedCategory
      return matchesSearch && matchesCat
    })
  }, [products, searchTerm, selectedCategory])

  // ── Pagination ──────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE))

  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
      ),
    [filtered, currentPage]
  )

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Page numbers with ellipsis
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

  // ── Stock update ────────────────────────────
  const handleStockBlur = useCallback(
    async (product: Product, value: string) => {
      const stock = Math.max(0, Number(value) || 0)
      if (stock === product.stock) return
      setSavingStockId(product.id)
      try {
        await onStockUpdate(product.id, stock)
      } finally {
        setSavingStockId(null)
      }
    },
    [onStockUpdate]
  )

  // ─────────────────────────────────────────────
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">

      {/* ── FILTER BAR ── */}
      <div className="shrink-0 rounded-3xl border border-[#eadfce] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(25,20,14,0.04)]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#23180f]">
              Search Products
            </label>
            <input
              type="text"
              placeholder="Name or SKU…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-12 w-full rounded-2xl border border-[#e7ddd0] bg-white px-4 text-sm outline-none transition-all duration-200 focus:border-[#c79a49] focus:ring-4 focus:ring-[#c79a49]/10"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#23180f]">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="h-12 w-full rounded-2xl border border-[#e7ddd0] bg-white px-4 text-sm outline-none transition-all duration-200 focus:border-[#c79a49] focus:ring-4 focus:ring-[#c79a49]/10"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Count */}
        <p className="mt-3 text-sm text-[#8c7a67]">
          {filtered.length === 0
            ? 'No products match'
            : `Showing ${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(currentPage * PRODUCTS_PER_PAGE, filtered.length)} of ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* ── TABLE ── */}
      {/*
        overflow-auto + overscroll-contain = native smooth wheel scroll inside this box.
        No transform/backdrop-blur on parents — those kill wheel smoothness.
      */}
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain rounded-3xl border border-[#eadfce] bg-white shadow-[0_10px_30px_rgba(25,20,14,0.04)]">
        <table className="w-full border-separate border-spacing-0">

          {/* STICKY HEADER */}
          <thead className="sticky top-0 z-20 bg-[#f7f2eb]">
            <tr>
              <th className="px-5 py-4 text-left text-sm font-semibold text-[#23180f] border-b border-[#eadfce]">Image</th>
              <th className="px-5 py-4 text-left text-sm font-semibold text-[#23180f] border-b border-[#eadfce]">SKU</th>
              <th className="px-5 py-4 text-left text-sm font-semibold text-[#23180f] border-b border-[#eadfce]">Product</th>
              <th className="px-5 py-4 text-left text-sm font-semibold text-[#23180f] border-b border-[#eadfce]">Category</th>
              <th className="px-5 py-4 text-left text-sm font-semibold text-[#23180f] border-b border-[#eadfce]">Price</th>
              <th className="px-5 py-4 text-left text-sm font-semibold text-[#23180f] border-b border-[#eadfce]">Stock</th>
              <th className="px-5 py-4 text-center text-sm font-semibold text-[#23180f] border-b border-[#eadfce]">Featured</th>
              <th className="px-5 py-4 text-center text-sm font-semibold text-[#23180f] border-b border-[#eadfce]">Enquired</th>
              <th className="px-5 py-4 text-center text-sm font-semibold text-[#23180f] border-b border-[#eadfce]">Actions</th>
            </tr>
          </thead>

          {/* BODY — only paginated rows rendered */}
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center text-sm text-[#7b6d5d]">
                  No products found
                </td>
              </tr>
            ) : (
              paginated.map(product => (
                <tr
                  key={product.id}
                  className="border-b border-[#f1e7da] transition-colors duration-150 hover:bg-[#fcfaf7]"
                >
                  {/* IMAGE */}
                  <td className="px-5 py-4 align-middle">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[#eadfce] bg-[#f8f4ef]">
                      {product.main_image ? (
                        <Image src={product.main_image} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#8c7a67]">—</div>
                      )}
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex flex-col gap-1.5">
                      <span className="inline-flex w-fit whitespace-nowrap rounded-xl border border-[#e7d3ae] bg-[#fff9ef] px-3 py-1.5 text-xs font-bold tracking-wide text-[#b9852c]">
                        {productSku(product)}
                      </span>
                      {product.category_code && (
                        <span className="text-xs uppercase tracking-wider text-[#8c7a67]">
                          {product.category_code}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* PRODUCT */}
                  <td className="px-5 py-4 align-middle">
                    <div className="max-w-[260px]">
                      <h3 className="line-clamp-2 text-sm font-semibold text-[#23180f] lg:text-base">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-[#8c7a67] lg:text-sm">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-5 py-4 align-middle">
                    <span className="inline-flex rounded-full bg-[#f8efe2] px-3 py-1 text-xs font-medium text-[#c28b39]">
                      {product.category}
                    </span>
                  </td>

                  {/* PRICE */}
                  <td className="px-5 py-4 align-middle">
                    <p className="text-sm font-semibold text-[#23180f] lg:text-base">
                      {formatCurrency(product.discounted_price || product.price)}
                    </p>
                    {product.discounted_price && (
                      <p className="text-xs text-[#8c7a67] line-through">
                        {formatCurrency(product.price)}
                      </p>
                    )}
                  </td>

                  {/* STOCK */}
                  <td className="px-5 py-4 align-middle">
                    <input
                      type="number"
                      min="0"
                      defaultValue={productStock(product)}
                      onBlur={e => handleStockBlur(product, e.target.value)}
                      className="h-10 w-20 rounded-xl border border-[#e6dbcf] bg-white px-3 text-sm outline-none transition-all duration-200 focus:border-[#c79a49] focus:ring-4 focus:ring-[#c79a49]/10"
                    />
                    {savingStockId === product.id && (
                      <p className="mt-1 text-xs text-[#8c7a67]">Saving…</p>
                    )}
                    {productStock(product) === 0 && (
                      <p className="mt-1 text-xs font-semibold text-red-500">Out of Stock</p>
                    )}
                    {productStock(product) > 0 && productStock(product) <= 5 && (
                      <p className="mt-1 text-xs font-semibold text-orange-500">
                        Only {productStock(product)} left
                      </p>
                    )}
                  </td>

                  {/* FEATURED toggle */}
<td className="px-5 py-4 text-center align-middle">
  <button
    type="button"
    aria-pressed={product.featured}
    onClick={() =>
      onFeaturedUpdate(
        product.id,
        !product.featured
      )
    }
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ease-out ${
      product.featured
        ? 'bg-[#c79a49]'
        : 'bg-[#d8d4cf]'
    }`}
  >
    <span
      className={`absolute left-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-all duration-300 ease-out will-change-transform ${
        product.featured
          ? 'translate-x-5'
          : 'translate-x-0'
      }`}
    />
  </button>
</td>

                  {/* ENQUIRED */}
                  <td className="px-5 py-4 text-center align-middle">
                    <span className="text-sm font-semibold text-[#23180f]">
                      {product.enquired_stock || 0}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors duration-150 hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors duration-150 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── PAGINATION BAR ── */}
      {totalPages > 1 && (
        <div className="shrink-0 flex flex-wrap items-center justify-center gap-2 py-4">

          {/* Prev */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 rounded-xl border border-[#e7ddd0] bg-white px-4 py-2.5 text-sm font-medium text-[#23180f] transition-colors duration-150 hover:bg-[#f8f4ef] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          {/* Pages */}
          {pageNumbers.map((p, i) =>
            p === '…' ? (
              <span key={`el-${i}`} className="px-1 text-[#8c7a67] select-none">…</span>
            ) : (
              <button
                key={p}
                onClick={() => goToPage(p as number)}
                aria-current={p === currentPage ? 'page' : undefined}
                className={`h-10 w-10 rounded-full text-sm font-medium transition-all duration-150 ${
                  p === currentPage
                    ? 'bg-[#c79a49] text-white shadow-sm'
                    : 'border border-[#e7ddd0] bg-white text-[#23180f] hover:bg-[#f8f4ef]'
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
            className="flex items-center gap-1.5 rounded-xl border border-[#e7ddd0] bg-white px-4 py-2.5 text-sm font-medium text-[#23180f] transition-colors duration-150 hover:bg-[#f8f4ef] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Info */}
          <span className="w-full text-center text-xs text-[#8c7a67]">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  )
}

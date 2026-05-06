'use client'

import { useEffect, useState } from 'react'

import { AdminHeader } from '@/components/admin/AdminHeader'
import { ProductForm } from '@/components/admin/ProductForm'
import { ProductList } from '@/components/admin/ProductList'

import { createClient } from '@/utils/supabase/client'
import { productService } from '@/services/productService'

import type { Product } from '@/types/product'

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    const data = await productService.getProducts()
    setProducts(data)
  }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      setUser({ email: currentUser?.email })

      await fetchProducts()

      setLoading(false)
    }

    load()
  }, [])

  const handleFormClose = async (changed?: boolean) => {
    setIsFormOpen(false)
    setSelectedProduct(null)

    if (changed) {
      await fetchProducts()
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return

    try {
      await productService.deleteProduct(id)
      await fetchProducts()
    } catch (err: any) {
      setError(err.message || 'Unable to delete product')
    }
  }

  const handleStockUpdate = async (
    id: string,
    stock: number
  ) => {
    try {
      await productService.updateProduct(id, { stock })
      await fetchProducts()
    } catch (err: any) {
      setError(err.message || 'Unable to update stock')
    }
  }

  const handleFeaturedUpdate = async (
    id: string,
    featured: boolean
  ) => {
    try {
      await productService.updateProduct(id, { featured })
      await fetchProducts()
    } catch (err: any) {
      setError(
        err.message || 'Unable to update featured status'
      )
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f8f4ef]">

      {/* HEADER */}
      <div className="shrink-0">
        <AdminHeader user={user} />
      </div>

      {/* CONTENT */}
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">

        <div className="mx-auto flex min-h-0 w-full max-w-[1800px] flex-1 flex-col overflow-hidden px-4 py-6 sm:px-6 lg:px-8">

          {/* TOP BAR */}
          <div className="mb-6 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="font-serif text-3xl font-bold text-[#23180f]">
                Products
              </h1>

              <p className="mt-1 text-sm text-[#7b6d5d]">
                Manage catalog, stock, pricing, and imagery.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedProduct(null)
                setIsFormOpen(true)
              }}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#c79a49] px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#b98933]"
            >
              Add Product
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 shrink-0 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* PRODUCT LIST */}
          <div className="min-h-0 flex-1 overflow-hidden">
            <ProductList
              products={products}
              onEdit={product => {
                setSelectedProduct(product)
                setIsFormOpen(true)
              }}
              onDelete={handleDeleteProduct}
              onStockUpdate={handleStockUpdate}
              onFeaturedUpdate={handleFeaturedUpdate}
            />
          </div>

        </div>
      </main>

      {/* MODAL */}
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}
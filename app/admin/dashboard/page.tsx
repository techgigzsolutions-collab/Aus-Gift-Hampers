'use client'

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ProductList } from '@/components/admin/ProductList'
import { ProductForm } from '@/components/admin/ProductForm'
import { createClient } from '@/utils/supabase/client'
import { productService } from '@/services/productService'
import type { Product } from '@/types/product'

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
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
    if (changed) await fetchProducts()
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

  const handleStockUpdate = async (id: string, stock: number) => {
    try {
      await productService.updateProduct(id, { stock })
      await fetchProducts()
    } catch (err: any) {
      setError(err.message || 'Unable to update stock')
    }
  }

  const handleFeaturedUpdate = async (id: string, featured: boolean) => {
    try {
      await productService.updateProduct(id, { featured })
      await fetchProducts()
    } catch (err: any) {
      setError(err.message || 'Unable to update featured status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">Manage catalog, stock, pricing, and product imagery.</p>
          </div>
          <button
            onClick={() => {
              setSelectedProduct(null)
              setIsFormOpen(true)
            }}
            className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors"
          >
            Add Product
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

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

        {isFormOpen && <ProductForm product={selectedProduct} onClose={handleFormClose} />}
      </div>
    </div>
  )
}

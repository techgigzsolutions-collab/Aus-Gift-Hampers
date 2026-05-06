'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types/product'
import { formatCurrency } from '@/lib/currency'
import { productSku, productStock } from '@/lib/productIdentity'

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onStockUpdate: (id: string, stock: number) => void
  onFeaturedUpdate: (id: string, featured: boolean) => void
}

const money = formatCurrency

export function ProductList({ products, onEdit, onDelete, onStockUpdate, onFeaturedUpdate }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [savingStockId, setSavingStockId] = useState<string | null>(null)

  const categories = Array.from(new Set(products.map(p => p.category)))

  const filteredProducts = products.filter(product => {
    const query = searchTerm.toLowerCase()
    const matchesSearch = product.name.toLowerCase().includes(query) || productSku(product).toLowerCase().includes(query)
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleStockBlur = async (product: Product, value: string) => {
    const stock = Math.max(0, Number(value) || 0)
    if (stock === product.stock) return
    setSavingStockId(product.id)
    await onStockUpdate(product.id, stock)
    setSavingStockId(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-foreground mb-2">Search Products</span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name or SKU"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-foreground mb-2">Category</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px]">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  {['Image', 'SKU', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Enquired', 'Actions'].map(label => (
                    <th key={label} className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary">
                        {product.main_image ? (
                          <Image src={product.main_image} alt={product.name} fill className="object-cover" />
                        ) : (
                          <span className="text-xs text-muted-foreground">No image</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-xs font-bold text-accent">
                        {productSku(product)}
                      </span>
                      {product.category_code && (
                        <p className="mt-2 text-xs text-muted-foreground">{product.category_code}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-foreground">{money(product.discounted_price || product.price)}</p>
                      {product.discounted_price && (
                        <p className="text-xs text-muted-foreground line-through">{money(product.price)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        defaultValue={productStock(product)}
                        onBlur={e => handleStockBlur(product, e.target.value)}
                        className="w-20 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      {productStock(product) === 0 && <p className="mt-1 text-xs font-semibold text-red-600">Out of Stock</p>}
                      {productStock(product) > 0 && productStock(product) <= 5 && <p className="mt-1 text-xs font-semibold text-orange-700">Only {productStock(product)} left</p>}
                      {savingStockId === product.id && (
                        <p className="text-xs text-muted-foreground mt-1">Saving...</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => onFeaturedUpdate(product.id, !product.featured)}
                        className={`relative h-7 w-12 rounded-full transition-colors ${
                          product.featured ? 'bg-accent' : 'bg-neutral-300'
                        }`}
                        aria-label={product.featured ? 'Unmark featured' : 'Mark featured'}
                      >
                        <span
                          className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            product.featured ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{product.enquired_stock || 0}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

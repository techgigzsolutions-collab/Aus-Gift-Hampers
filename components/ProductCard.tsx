'use client'

import { useState } from 'react'
import { Product } from '@/lib/products'
import { QuantityControl } from './QuantityControl'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, quantity: number) => void
  isEditing?: boolean
  onStockUpdate?: (productId: string, newStock: number) => void
}

export function ProductCard({
  product,
  onAddToCart,
  isEditing = false,
  onStockUpdate,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(0)
  const [editStock, setEditStock] = useState(product.stock)
  const [showNotification, setShowNotification] = useState(false)

  const handleAddToCart = () => {
    if (quantity > 0) {
      onAddToCart(product, quantity)
      setQuantity(0)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 2000)
    }
  }

  const handleStockUpdate = () => {
    if (onStockUpdate) {
      onStockUpdate(product.id, editStock)
    }
  }

  const isOutOfStock = product.stock === 0

  return (
    <div className="group relative bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border/50 flex flex-col h-full">
      {/* Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
          Out of Stock
        </div>
      )}
      {product.stock < 5 && !isOutOfStock && (
        <div className="absolute top-3 right-3 bg-accent/80 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
          Only {product.stock} left
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full h-56 bg-neutral-200 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isEditing && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Stock: {editStock}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        <div className="mb-4">
          <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-2">
            {product.category}
          </p>
          <h3 className="font-serif text-lg font-bold text-foreground mb-3 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-neutral-600 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Items List */}
        <div className="mb-5 p-4 bg-secondary/30 rounded-xl">
          <p className="text-xs font-semibold text-foreground mb-3">Includes:</p>
          <ul className="text-xs text-neutral-700 space-y-1.5">
            {product.items.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                {item}
              </li>
            ))}
            {product.items.length > 3 && (
              <li className="text-accent font-semibold pt-1">+{product.items.length - 3} more</li>
            )}
          </ul>
        </div>

        {/* Price */}
        <div className="mb-6 pb-6 border-b border-border">
          <p className="text-3xl font-bold text-accent">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-neutral-500 mt-2">Premium Luxury Collection</p>
        </div>

        {/* Controls - Push to bottom */}
        <div className="mt-auto">
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-foreground">Update Stock:</label>
                <input
                  type="number"
                  min="0"
                  value={editStock}
                  onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                onClick={handleStockUpdate}
                className="w-full px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-md"
              >
                Update Stock
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <QuantityControl
                quantity={quantity}
                maxQuantity={product.stock}
                onQuantityChange={setQuantity}
              />
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || quantity === 0}
                className="w-full px-4 py-2.5 bg-accent hover:bg-accent-dark disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-md active:scale-95"
              >
                {quantity > 0 ? `Add ${quantity} to Cart` : 'Select Quantity'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showNotification && (
        <div className="absolute bottom-4 left-4 right-4 bg-accent text-white text-sm font-semibold px-4 py-2 rounded-lg animate-fade-in">
          ✓ Added to cart!
        </div>
      )}
    </div>
  )
}

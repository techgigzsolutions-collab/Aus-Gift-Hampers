'use client'

import { Product } from '@/lib/products'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product, quantity: number) => void
  isEditing?: boolean
  onStockUpdate?: (productId: string, newStock: number) => void
}

export function ProductGrid({
  products,
  onAddToCart,
  isEditing = false,
  onStockUpdate,
}: ProductGridProps) {
  return (
    <section id="products" className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm md:text-base tracking-widest uppercase mb-4">
            Our Collection
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            Premium Hamper Collections
          </h2>
          <p className="text-neutral-600 text-lg max-w-3xl mx-auto text-balance leading-relaxed">
            Explore our handpicked selection of luxury hampers, each thoughtfully curated with the finest ingredients and artisanal products.
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start content-start">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  isEditing={isEditing}
                  onStockUpdate={onStockUpdate}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">No products available.</p>
          </div>
        )}
      </div>
    </section>
  )
}

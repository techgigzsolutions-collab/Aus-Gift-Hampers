'use client'

import Image from 'next/image'
import { products } from '@/lib/products'

export function NewArrivals() {
  // Get all products for new arrivals
  const arrivals = products.slice(0, 8)

  return (
    <section id="new-arrivals" className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Latest</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 mt-2">
            New Arrivals
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Fresh collections just added to our store
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {arrivals.map((product, index) => (
            <div
              key={product.id}
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Image Container with Badge */}
              <div className="relative h-72 rounded-xl overflow-hidden mb-6 bg-neutral-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* New Badge */}
                <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                  New
                </div>

                {/* Stock Badge */}
                {product.stock < 5 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Low Stock
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-2">
                  {product.category}
                </p>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-foreground">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <button className="px-3 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-lg transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

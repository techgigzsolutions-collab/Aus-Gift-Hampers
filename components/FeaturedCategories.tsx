'use client'

import Image from 'next/image'

interface Category {
  id: number
  name: string
  image: string
  count: number
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Luxury Collections',
    image: '/hamper-1.jpg',
    count: 24,
  },
  {
    id: 2,
    name: 'Wellness & Spa',
    image: '/hamper-3.jpg',
    count: 18,
  },
  {
    id: 3,
    name: 'Gourmet Selection',
    image: '/hamper-2.jpg',
    count: 32,
  },
  {
    id: 4,
    name: 'Festive Hampers',
    image: '/hamper-5.jpg',
    count: 28,
  },
]

export function FeaturedCategories() {
  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Explore our curated collections
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm">{category.count} products</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

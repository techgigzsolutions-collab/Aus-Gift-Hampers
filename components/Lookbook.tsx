'use client'

import Image from 'next/image'
import { useState } from 'react'

interface LookbookImage {
  id: number
  image: string
  title: string
  description: string
}

const lookbookImages: LookbookImage[] = [
  {
    id: 1,
    image: '/hamper-1.jpg',
    title: 'Luxury Elegance',
    description: 'Premium hampers for special occasions',
  },
  {
    id: 2,
    image: '/hamper-6.jpg',
    title: 'Artisan Collection',
    description: 'Handcrafted with care',
  },
  {
    id: 3,
    image: '/hamper-7.jpg',
    title: 'Tea Time Bliss',
    description: 'Exotic teas and treats',
  },
  {
    id: 4,
    image: '/hamper-8.jpg',
    title: 'Chocolate Paradise',
    description: 'Premium selections from around the world',
  },
]

export function Lookbook() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="lookbook" className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Lookbook
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Visual inspiration from our collections
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lookbookImages.map((item) => (
            <div
              key={item.id}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />

              {/* Content */}
              <div
                className={`absolute inset-0 flex flex-col justify-center items-center text-center transition-all duration-300 ${
                  hoveredId === item.id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <h3 className="font-serif text-3xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/90 text-lg mb-6 max-w-xs">
                  {item.description}
                </p>
                <button className="px-6 py-2 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

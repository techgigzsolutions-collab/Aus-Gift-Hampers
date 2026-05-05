'use client'

import { useState, useEffect } from 'react'

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/hamper-1.jpg)',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40" />
      </div>

      {/* Animated background elements for extra depth */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 right-10 w-96 h-96 bg-accent/15 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 text-center px-4 sm:px-6 max-w-3xl transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mb-8">
          <p className="text-accent font-semibold text-sm md:text-base tracking-widest uppercase mb-4">
            Elegant Gifts for Every Occasion
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight text-balance">
            Premium Hampers
          </h1>
          <p className="text-lg md:text-xl text-white/90 text-balance leading-relaxed mb-10">
            Discover our curated collection of luxury gift hampers, meticulously assembled with the finest ingredients and artisanal products.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#products"
            className="px-8 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all duration-300 ease-out hover:shadow-xl hover:scale-105"
          >
            Browse Collection
          </a>
          <button
            onClick={() => {
              const element = document.getElementById('products')
              element?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-3 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-300"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

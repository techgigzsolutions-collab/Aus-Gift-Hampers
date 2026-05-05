'use client'

import Image from 'next/image'

export function PromoBanner() {
  return (
    <section data-motion-section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div data-motion-child className="relative h-96 rounded-3xl overflow-hidden shadow-2xl shadow-black/15">
          <Image
            src="/hamper-4.jpg"
            alt="Special Offer"
            fill
            className="object-cover will-change-transform"
            data-image-scale
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-start px-8 sm:px-12 lg:px-16" data-parallax="0.25">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">
              Limited Time Offer
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4 max-w-md">
              Exclusive Deals
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-md">
              Discover special bundles and limited edition collections
            </p>
            <button className="motion-button px-8 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors">
              Shop Offers
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

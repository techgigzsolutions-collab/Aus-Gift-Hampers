'use client'

import { CreditCard, RotateCcw, Truck } from 'lucide-react'

const features = [
  {
    id: 1,
    Icon: Truck,
    title: 'Express Delivery',
    description: 'Fast and reliable shipping across Australia with real-time tracking',
  },
  {
    id: 2,
    Icon: RotateCcw,
    title: 'Free Returns',
    description: "Hassle-free returns within 30 days if you're not satisfied",
  },
  {
    id: 3,
    Icon: CreditCard,
    title: 'Secure Payments',
    description: 'Multiple payment options with 100% secure transactions',
  },
]

export function FeaturesGrid() {
  return (
    <section id="reviews" data-motion-section className="py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map(({ id, Icon, title, description }) => (
            <div key={id} data-motion-child className="text-center group">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 will-change-transform">
                <Icon className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">{title}</h3>
              <p className="text-neutral-600 font-light leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

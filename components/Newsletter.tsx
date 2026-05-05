'use client'

import { useState } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-foreground text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
          Stay Updated
        </h2>
        <p className="text-white/80 text-lg mb-8">
          Subscribe to our newsletter for exclusive offers and new arrivals
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-3 rounded-lg text-foreground placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 bg-accent hover:bg-accent-dark font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>

        {isSubscribed && (
          <p className="mt-4 text-accent font-semibold animate-fade-in">
            Thank you for subscribing!
          </p>
        )}

        <p className="text-white/60 text-sm mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}

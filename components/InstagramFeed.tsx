'use client'

import { useState } from 'react'
import Image from 'next/image'

interface InstaPost {
  id: number
  image: string
  likes: number
  comments: number
}

const instaPosts: InstaPost[] = [
  { id: 1, image: '/hamper-1.jpg', likes: 1230, comments: 45 },
  { id: 2, image: '/hamper-2.jpg', likes: 980, comments: 32 },
  { id: 3, image: '/hamper-3.jpg', likes: 1450, comments: 58 },
  { id: 4, image: '/hamper-4.jpg', likes: 1100, comments: 38 },
  { id: 5, image: '/hamper-5.jpg', likes: 1320, comments: 52 },
  { id: 6, image: '/hamper-6.jpg', likes: 1050, comments: 41 },
  { id: 7, image: '/hamper-7.jpg', likes: 1200, comments: 48 },
]

export function InstagramFeed() {
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition((e.target as HTMLDivElement).scrollLeft)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-light text-sm tracking-widest uppercase mb-4">
            Follow Us
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            @anamika.luxury
          </h2>
          <p className="text-neutral-600 text-lg mb-8">
            Discover moments of elegance and inspiration from our community
          </p>
          <a
            href="https://instagram.com/anamika.luxury"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white hover:bg-accent-dark transition-colors duration-300 rounded-lg font-light"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm3.6-9.2H8.4v-1.6h7.2v1.6zm0-3.2H8.4V7.2h7.2v2.6z" />
            </svg>
            Follow on Instagram
          </a>
        </div>

        {/* Instagram Grid - Horizontal Scroll */}
        <div
          className="overflow-x-auto scrollbar-hide"
          onScroll={handleScroll}
        >
          <div className="flex gap-4 pb-4">
            {instaPosts.map((post, index) => (
              <a
                key={post.id}
                href={`https://instagram.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-shrink-0 w-64 h-64 overflow-hidden rounded-lg"
              >
                <Image
                  src={post.image}
                  alt={`Instagram post ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-6 text-white text-center">
                    <div>
                      <svg className="w-6 h-6 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span className="text-sm font-light">{post.likes}</span>
                    </div>
                    <div>
                      <svg className="w-6 h-6 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="text-sm font-light">{post.comments}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

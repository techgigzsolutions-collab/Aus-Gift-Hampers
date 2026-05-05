'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
  cta: string
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/hamper-1.jpg',
    title: 'Luxury Hampers',
    subtitle: 'Handcrafted collections for every occasion',
    cta: 'Shop Now',
  },
  {
    id: 2,
    image: '/hamper-3.jpg',
    title: 'Premium Wellness',
    subtitle: 'Spa and relaxation essentials',
    cta: 'Explore',
  },
  {
    id: 3,
    image: '/hamper-5.jpg',
    title: 'Festive Collections',
    subtitle: 'Celebrate with elegance and style',
    cta: 'Discover',
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlay(false)
  }

  useLayoutEffect(() => {
    if (!heroRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-word]',
        { yPercent: 110, autoAlpha: 0, rotateX: 28 },
        { yPercent: 0, autoAlpha: 1, rotateX: 0, duration: 1.05, stagger: 0.08, ease: 'power4.out' }
      )
      gsap.fromTo(
        '[data-hero-copy]',
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, delay: 0.38, ease: 'power3.out' }
      )
      gsap.to('[data-hero-bg]', {
        scale: 1.07,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
      gsap.to('[data-hero-content]', {
        yPercent: 16,
        autoAlpha: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: '45% top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative w-full h-screen bg-white overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover will-change-transform"
              data-hero-bg={index === currentSlide ? '' : undefined}
              priority={index === 0}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/28 to-black/60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,transparent_0,rgba(0,0,0,0.42)_68%)]" />

            {/* Content */}
            <div data-hero-content className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 pt-16">
              <h1
                className={`font-serif text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-4 transition-all duration-1000 leading-[0.95] ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                {slide.title.split(' ').map(word => (
                  <span key={word} className="inline-block overflow-hidden px-1">
                    <span data-hero-word className="inline-block will-change-transform">
                      {word}
                    </span>
                  </span>
                ))}
              </h1>
              <p
                data-hero-copy
                className={`text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl transition-all duration-1000 delay-100 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                {slide.subtitle}
              </p>
              <button
                data-hero-copy
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className={`motion-button px-8 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all duration-1000 delay-200 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-3 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

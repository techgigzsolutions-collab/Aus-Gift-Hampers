'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, MessageCircle, Minus, Plus, ShoppingBag, Star, Truck } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Product } from '@/types/product'
import { useCommerce, money, productPrice } from '@/components/commerce/CommerceProvider'
import { productService } from '@/services/productService'
import { productSku, productStock } from '@/lib/productIdentity'
import { buildLocationBlock, openWhatsApp } from '@/lib/whatsapp'

gsap.registerPlugin(ScrollTrigger)

interface ProductPageClientProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const commerce = useCommerce()
  const router = useRouter()
  const pageRef = useRef<HTMLDivElement>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState('')
  const [visibleEnquiredStock, setVisibleEnquiredStock] = useState(product.enquired_stock || 0)

  const images = useMemo(() => [product.main_image, ...(product.sub_images || [])].filter(Boolean), [product])
  const stock = productStock(product)
  const isOutOfStock = stock === 0
  const unitPrice = productPrice(product)
  const hasDiscount = product.discounted_price !== null && product.discounted_price < product.price
  const savings = hasDiscount ? product.price - (product.discounted_price || 0) : 0
  const savingsPercent = hasDiscount && product.price > 0 ? Math.round((savings / product.price) * 100) : 0
  const hasRating = product.rating !== null || product.reviews_count > 0
  const related = relatedProducts.filter(item => item.product_code !== product.product_code).slice(0, 4)

  useEffect(() => {
    commerce.registerProducts([product, ...relatedProducts])
  }, [commerce.registerProducts, product, relatedProducts])

  useEffect(() => {
    setQuantity(1)
    setActiveImage(0)
    setVisibleEnquiredStock(product.enquired_stock || 0)
  }, [product.product_code, product.enquired_stock])

  useLayoutEffect(() => {
    if (!pageRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-product-hero]',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      )

      gsap.fromTo(
        '[data-product-section]',
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pageRef.current,
            start: 'top 70%',
          },
        }
      )

      if (pageRef.current?.querySelector('[data-related-grid]')) {
        gsap.fromTo(
          '[data-related-card]',
          { autoAlpha: 0, x: 42 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '[data-related-grid]',
              start: 'top 82%',
              once: true,
            },
          }
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [product.product_code])

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(''), 2400)
  }

  const updateQuantity = (change: number) => {
    if (isOutOfStock) return

    setQuantity(current => {
      const next = current + change
      if (next > stock) {
        showToast(`Only ${stock} items available`)
        return current
      }

      return Math.min(Math.max(next, 1), stock)
    })
  }

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('Out of Stock')
      return
    }

    commerce.addToCart(product, quantity)
    showToast(`Added ${quantity} to cart`)
  }

  const handleWhatsApp = async () => {
    if (isOutOfStock) {
      showToast('Out of Stock')
      return
    }

    try {
      await productService.updateEnquiredStock(product.id, quantity)
      setVisibleEnquiredStock(current => current + quantity)
    } catch (error) {
      console.error('Unable to update enquired stock', error)
    }

    // Build message on click — region read fresh at this moment
    openWhatsApp(() => [
      'Hi, I want to order:',
      '',
      `- ${product.name} (${productSku(product)})`,
      `  Quantity: ${quantity}`,
      `  Price: ${money(unitPrice * quantity)}`,
      `  Delivery: ${product.estimated_delivery}`,
      '',
      buildLocationBlock(),
    ].join('\n'))
  }

  const changeImage = (direction: 1 | -1) => {
    setActiveImage(current => (current + direction + images.length) % images.length)
  }

  const handleTouchEnd = (endX: number) => {
    if (touchStart === null || images.length < 2) return
    const delta = touchStart - endX
    if (Math.abs(delta) > 40) changeImage(delta > 0 ? 1 : -1)
    setTouchStart(null)
  }

  return (
    <div ref={pageRef} className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        <div className="mb-6">
          <Link href="/shop" className="text-sm text-muted-foreground hover:text-accent transition-colors">
            Back to shop
          </Link>
        </div>

        <div data-product-hero className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <section className="space-y-4">
            <div
              className="relative overflow-hidden rounded-2xl border border-border bg-card aspect-[4/4.5]"
              onTouchStart={event => setTouchStart(event.touches[0].clientX)}
              onTouchEnd={event => handleTouchEnd(event.changedTouches[0].clientX)}
            >
              <Image
                src={images[activeImage] || product.main_image}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => changeImage(-1)}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition-transform hover:scale-105"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => changeImage(1)}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition-transform hover:scale-105"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-card ${
                      activeImage === index ? 'border-accent' : 'border-border'
                    }`}
                  >
                    <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="text-left">
            {product.category && (
              <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-accent">
                {product.category}
              </p>
            )}

            <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
              {product.name}
            </h1>

            {hasRating && (
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {product.rating !== null && (
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium text-foreground">{Number(product.rating).toFixed(1)}</span>
                  </div>
                )}
                {product.reviews_count > 0 && <span>({product.reviews_count} reviews)</span>}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <p className="text-xl sm:text-2xl font-semibold text-foreground">{money(unitPrice)}</p>
              {hasDiscount && (
                <>
                  <p className="text-base sm:text-lg text-muted-foreground line-through">{money(product.price)}</p>
                  <p className="text-sm text-muted-foreground">Save {money(savings)} ({savingsPercent}%)</p>
                </>
              )}
            </div>

            {product.description && (
              <p className="mt-5 text-sm sm:text-base text-muted-foreground leading-7">
                {product.description}
              </p>
            )}

            <div className="mt-6 space-y-3 border-y border-border py-5">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">SKU:</span> {productSku(product)}
              </p>

              {typeof product.stock === 'number' && (
                <p className={`text-sm ${isOutOfStock || stock <= 5 ? 'text-destructive' : 'text-foreground'}`}>
                  {isOutOfStock ? 'Out of Stock' : stock <= 5 ? `Only ${stock} left` : `In Stock: ${stock}`}
                </p>
              )}

              {visibleEnquiredStock > 0 && (
                <p className="text-sm text-muted-foreground">
                  {visibleEnquiredStock} people are interested
                </p>
              )}

              {product.estimated_delivery && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 text-accent" />
                  <span>{product.estimated_delivery}</span>
                </div>
              )}
            </div>

            {!isOutOfStock && (
              <div className="mt-6">
                <div className="inline-flex items-center rounded-xl border border-border bg-card">
                  <button
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity === 1}
                    className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-base font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(1)}
                    disabled={quantity >= stock}
                    className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-foreground bg-foreground px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:border-border disabled:bg-muted"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                onClick={handleWhatsApp}
                disabled={isOutOfStock}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:bg-muted"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Order
              </button>
            </div>
          </section>
        </div>

        {product.description && (
          <section data-product-section className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl sm:text-2xl font-semibold">Product Details</h2>
            <p className="mt-4 max-w-3xl text-sm sm:text-base text-muted-foreground leading-7">
              {product.description}
            </p>
          </section>
        )}

        {hasRating && (
          <section data-product-section className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl sm:text-2xl font-semibold">Reviews</h2>
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              {product.rating !== null && (
                <div className="flex items-center gap-1 text-accent">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium text-foreground">{Number(product.rating).toFixed(1)}</span>
                </div>
              )}
              {product.reviews_count > 0 && <span>{product.reviews_count} reviews</span>}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section data-product-section className="mt-16 border-t border-border pt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">You May Also Like</h2>
                {product.category && <p className="mt-2 text-sm text-muted-foreground">More from {product.category}</p>}
              </div>
              <Link href="/shop" className="text-sm font-medium text-accent hover:opacity-80 transition-opacity">
                View all
              </Link>
            </div>

            <div data-related-grid className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {related.map(item => (
                <article
                  key={productSku(item)}
                  data-related-card
                  className="cursor-pointer overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-md"
                  onClick={() => router.push(`/product/${productSku(item)}`)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <Image
                      src={item.main_image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    {item.category && <p className="text-xs uppercase tracking-[0.2em] text-accent">{item.category}</p>}
                    <h3 className="mt-2 text-lg font-semibold text-foreground">{item.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Code: {productSku(item)}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-base font-semibold text-foreground">{money(productPrice(item))}</p>
                      <button
                        onClick={event => {
                          event.stopPropagation()
                          if (productStock(item) > 0) commerce.addToCart(item, 1)
                        }}
                        disabled={productStock(item) === 0}
                        className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur md:hidden">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{quantity} item{quantity !== 1 ? 's' : ''}</span>
          <span className="font-semibold text-foreground">{money(unitPrice * quantity)}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-muted"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </button>
          <button
            onClick={handleWhatsApp}
            disabled={isOutOfStock}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:bg-muted"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-24 right-4 z-[60] rounded-full bg-foreground px-5 py-3 text-sm font-medium text-white shadow-lg md:bottom-6 md:right-6">
          {toastMessage}
        </div>
      )}
    </div>
  )
}

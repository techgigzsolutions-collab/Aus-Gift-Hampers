'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Tag,
  Truck,
  Users,
  X,
  ZoomIn,
} from 'lucide-react'
import type { Product } from '@/types/product'
import { formatCurrency } from '@/lib/currency'
import { productService } from '@/services/productService'
import { isLowStock, productSku, productStock } from '@/lib/productIdentity'
import { getWhatsAppHref } from '@/lib/whatsapp'
import gsap from 'gsap'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart?: (product: Product, quantity: number) => void
  onToggleWishlist?: (product: Product) => void
  isWishlisted?: boolean
  isInCart?: boolean
}

const money = formatCurrency
const displayPrice = (product: Product) => product.discounted_price || product.price

const trustPillars = [
  { icon: Package, title: 'Premium Quality', copy: 'Curated with care' },
  { icon: Truck, title: 'Fast Delivery', copy: '5-7 business days' },
  { icon: ShoppingBag, title: 'Perfect Gifting', copy: 'For every occasion' },
  { icon: ShieldCheck, title: 'Secure Packaging', copy: 'Safe & elegant' },
]

export function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  isInCart = false,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [toastMessage, setToastMessage] = useState('')
  const [visibleEnquiredStock, setVisibleEnquiredStock] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const imageStageRef = useRef<HTMLDivElement>(null)

  const images = useMemo(() => {
    if (!product) return []
    return [product.main_image, ...(product.sub_images || [])].filter(Boolean)
  }, [product])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setQuantity(1)
      setActiveImage(0)
      setVisibleEnquiredStock(product?.enquired_stock || 0)
      setDescriptionExpanded(false)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, product?.product_code])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: window.innerWidth < 768 ? 72 : 20, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.82, ease: 'back.out(1.12)' }
      )
      gsap.fromTo(
        '[data-modal-child]',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.05, delay: 0.14, ease: 'power3.out' }
      )
    }, panelRef)

    return () => ctx.revert()
  }, [isOpen, product?.product_code])

  useLayoutEffect(() => {
    if (!imageStageRef.current || !isOpen) return
    gsap.fromTo(
      imageStageRef.current,
      { autoAlpha: 0.78, x: 14, scale: 1.01 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 0.38, ease: 'power2.out' }
    )
  }, [activeImage, isOpen])

  if (!isOpen || !product) return null

  const stock = productStock(product)
  const isOutOfStock = stock === 0
  const unitPrice = displayPrice(product)
  const savings = product.discounted_price ? Math.max(product.price - product.discounted_price, 0) : 0
  const savingsPercent = product.discounted_price && product.price > 0 ? Math.round((savings / product.price) * 100) : 0
  const ratingValue = product.rating ? Number(product.rating).toFixed(1) : '4.8'
  const truncatedDescription = product.description.length > 150 && !descriptionExpanded
    ? `${product.description.slice(0, 150).trimEnd()}...`
    : product.description
  const maxGalleryCount = Math.min(images.length, 6)

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(''), 2600)
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
    onAddToCart?.(product, quantity)
    showToast(`Added ${quantity} to cart`)
  }

  const handleWishlist = () => {
    onToggleWishlist?.(product)
    showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleWhatsApp = async () => {
    if (isOutOfStock) {
      showToast('Out of Stock')
      return
    }

    const message = [
      'Hi, I want to order:',
      '',
      `- ${product.name} (${productSku(product)})`,
      `  Quantity: ${quantity}`,
      `  Price: ${money(unitPrice * quantity)}`,
      `  Delivery: ${product.estimated_delivery}`,
    ].join('\n')

    try {
      await productService.updateEnquiredStock(product.id, quantity)
      setVisibleEnquiredStock(current => current + quantity)
    } catch (error) {
      console.error('Unable to update enquired stock', error)
    }

    window.open(getWhatsAppHref(message), '_blank')
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

  const copySku = async () => {
    try {
      await navigator.clipboard.writeText(productSku(product))
      showToast('SKU copied')
    } catch {
      showToast(productSku(product))
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[rgba(20,16,12,0.64)] backdrop-blur-md" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:px-5 lg:px-8 pointer-events-none">
        <div
          ref={panelRef}
          className="pointer-events-auto relative flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-white/50 bg-[#f8f6f3] shadow-[0_28px_120px_rgba(24,18,10,0.3)] md:max-h-[94vh] md:max-w-[1500px] md:rounded-[2rem]"
          onClick={event => event.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-[#ede4d7] bg-white/90 text-[#2a231d] shadow-[0_10px_30px_rgba(36,26,16,0.08)] transition-all hover:scale-105 hover:bg-white"
            aria-label="Close product details"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex-1 overflow-y-auto">
            <div className="grid min-h-full gap-0 md:grid-cols-[minmax(0,1.5fr)_minmax(380px,1fr)]">
              <section className="border-b border-[#e8dfd2] bg-[linear-gradient(180deg,#fbf9f6,#f4efe8)] px-4 pb-6 pt-6 md:border-b-0 md:border-r md:px-6 lg:px-7">
                <div className="grid gap-4 lg:grid-cols-[96px_minmax(0,1fr)]">
                  <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:max-h-[720px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
                    {images.slice(0, maxGalleryCount).map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        onClick={() => setActiveImage(index)}
                        className={`group relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.35rem] border bg-white shadow-[0_12px_30px_rgba(30,22,13,0.07)] transition-all duration-300 ${
                          activeImage === index
                            ? 'border-[#c8a96a] ring-2 ring-[#c8a96a]/30 shadow-[0_16px_34px_rgba(200,169,106,0.22)]'
                            : 'border-[#ebe1d3] hover:-translate-y-0.5 hover:border-[#d9b97b]'
                        }`}
                      >
                        <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </button>
                    ))}
                  </div>

                  <div className="order-1 space-y-4 lg:order-2">
                    <div
                      ref={imageStageRef}
                      className="relative aspect-[0.95/1] overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_24px_60px_rgba(28,20,12,0.12)]"
                      onTouchStart={event => setTouchStart(event.touches[0].clientX)}
                      onTouchEnd={event => handleTouchEnd(event.changedTouches[0].clientX)}
                    >
                      <Image
                        src={images[activeImage] || product.main_image}
                        alt={product.name}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 hover:scale-[1.08]"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />

                      <button
                        onClick={copySku}
                        className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/88 px-4 py-2 text-sm font-semibold text-[#4f4538] shadow-[0_10px_24px_rgba(20,16,12,0.08)] backdrop-blur"
                      >
                        <span>SKU: {productSku(product)}</span>
                        <Copy className="h-4 w-4" />
                      </button>

                      <button
                        className="absolute right-4 top-[4.75rem] hidden h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/88 text-[#2f2720] shadow-[0_10px_24px_rgba(20,16,12,0.08)] backdrop-blur md:flex"
                        aria-label="Zoom image"
                      >
                        <ZoomIn className="h-5 w-5" />
                      </button>

                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => changeImage(-1)}
                            className="absolute left-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(23,19,16,0.72)] text-white shadow-[0_18px_30px_rgba(0,0,0,0.18)] transition-all hover:scale-105 hover:bg-[rgba(23,19,16,0.82)]"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                          <button
                            onClick={() => changeImage(1)}
                            className="absolute right-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(23,19,16,0.72)] text-white shadow-[0_18px_30px_rgba(0,0,0,0.18)] transition-all hover:scale-105 hover:bg-[rgba(23,19,16,0.82)]"
                            aria-label="Next image"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="grid gap-3 rounded-[1.5rem] border border-white/70 bg-white/70 p-4 shadow-[0_18px_50px_rgba(28,20,12,0.07)] sm:grid-cols-2 xl:grid-cols-4">
                      {trustPillars.map(item => {
                        const Icon = item.icon
                        return (
                          <div key={item.title} className="flex items-start gap-3 rounded-2xl px-2 py-3">
                            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#fbf5ea] text-[#c8a96a]">
                              <Icon className="h-5 w-5" strokeWidth={1.8} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#221b14]">{item.title}</p>
                              <p className="mt-1 text-sm text-[#7d6f60]">{item.copy}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex flex-col bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(248,246,243,1)_58%)] px-5 pb-28 pt-7 sm:px-6 md:px-8 md:pb-8 lg:px-10">
                <div className="space-y-6">
                  <div data-modal-child>
                    <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#c8a96a]">{product.category}</p>
                    <h1 className="mt-4 max-w-[14ch] font-serif text-4xl font-bold leading-[1.02] text-[#1f1915] sm:text-5xl">
                      {product.name}
                    </h1>
                  </div>

                  <div data-modal-child className="flex flex-wrap items-center gap-3 text-[#4d4338]">
                    <div className="flex items-center gap-1 text-[#c8a96a]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-5 w-5 fill-current" strokeWidth={1.5} />
                      ))}
                    </div>
                    <p className="text-base">
                      <span className="font-semibold text-[#3a3128]">{ratingValue}</span> ({product.reviews_count || 128} reviews)
                    </p>
                  </div>

                  <div data-modal-child className="space-y-3">
                    <div className="flex flex-wrap items-end gap-4">
                      <p className="text-5xl font-bold tracking-tight text-[#c39545]">{money(unitPrice)}</p>
                      {product.discounted_price && <p className="pb-1 text-3xl text-[#8a8278] line-through">{money(product.price)}</p>}
                    </div>
                    {savings > 0 && (
                      <div className="inline-flex rounded-full bg-[#e4f1de] px-4 py-2 text-base font-semibold text-[#5d9853]">
                        You save {money(savings)} ({savingsPercent}%)
                      </div>
                    )}
                  </div>

                  <div data-modal-child className="space-y-3">
                    <p className="max-w-2xl text-[1.05rem] leading-8 text-[#4f4538]">{truncatedDescription}</p>
                    {product.description.length > 150 && (
                      <button
                        onClick={() => setDescriptionExpanded(current => !current)}
                        className="inline-flex items-center gap-2 text-lg font-semibold text-[#c39545] transition-colors hover:text-[#a97a2d]"
                      >
                        {descriptionExpanded ? 'Read less' : 'Read more'}
                        <ChevronRight className={`h-5 w-5 transition-transform ${descriptionExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    )}
                  </div>

                  <div data-modal-child className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-[#eadfce] bg-white px-5 py-5 shadow-[0_16px_36px_rgba(24,18,10,0.06)] transition-transform hover:-translate-y-0.5">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fbf5ea] text-[#c8a96a]">
                        <Tag className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8e7f6f]">SKU</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-xl font-bold text-[#1f1915]">{productSku(product)}</p>
                        <button onClick={copySku} className="text-[#6b5f52] transition-colors hover:text-[#c39545]" aria-label="Copy SKU">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-[#8b7d6d]">Unique product code</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#eadfce] bg-white px-5 py-5 shadow-[0_16px_36px_rgba(24,18,10,0.06)] transition-transform hover:-translate-y-0.5">
                      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${isLowStock(product) || isOutOfStock ? 'bg-[#fff1ee] text-[#d1543f]' : 'bg-[#fbf5ea] text-[#c8a96a]'}`}>
                        <Package className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8e7f6f]">Stock</p>
                      <p className={`mt-3 text-xl font-bold ${isOutOfStock ? 'text-[#c14f3a]' : isLowStock(product) ? 'text-[#d1543f]' : 'text-[#1f1915]'}`}>
                        {isOutOfStock ? 'Out of stock' : isLowStock(product) ? `Only ${stock} left` : `In Stock: ${stock}`}
                      </p>
                      <p className="mt-2 text-sm text-[#8b7d6d]">{isLowStock(product) ? 'Hurry, limited stock!' : 'Ready for dispatch'}</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#eadfce] bg-white px-5 py-5 shadow-[0_16px_36px_rgba(24,18,10,0.06)] transition-transform hover:-translate-y-0.5">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fbf5ea] text-[#c8a96a]">
                        <Users className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8e7f6f]">Interest</p>
                      <p className="mt-3 text-xl font-bold text-[#1f1915]">{visibleEnquiredStock} people</p>
                      <p className="mt-2 text-sm text-[#8b7d6d]">are interested</p>
                    </div>
                  </div>

                  <div data-modal-child className="rounded-[1.4rem] border border-[#eadfce] bg-white px-5 py-4 shadow-[0_14px_34px_rgba(24,18,10,0.05)]">
                    <div className="inline-flex items-center gap-3 text-lg text-[#3b3126]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fbf5ea] text-[#c8a96a]">
                        <Truck className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <span>Delivery between {product.estimated_delivery}</span>
                    </div>
                  </div>

                  <div data-modal-child className="space-y-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-5">
                        <span className="text-lg font-medium text-[#29211b]">Quantity</span>
                        <div className="inline-flex items-center rounded-[1.25rem] border border-[#e6dbc9] bg-white px-3 py-2 shadow-[0_12px_26px_rgba(24,18,10,0.05)]">
                          <button
                            onClick={() => updateQuantity(-1)}
                            disabled={quantity === 1}
                            className="flex h-12 w-12 items-center justify-center rounded-xl text-[#2b231d] transition-colors hover:bg-[#f7f0e5] disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-5 w-5" />
                          </button>
                          <span className="w-16 text-center text-3xl font-semibold text-[#1f1915]">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(1)}
                            disabled={quantity >= stock}
                            className="flex h-12 w-12 items-center justify-center rounded-xl text-[#2b231d] transition-colors hover:bg-[#f7f0e5] disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {isLowStock(product) && !isOutOfStock && (
                        <div className="rounded-full bg-[#fff1ee] px-4 py-3 text-sm font-semibold text-[#d1543f]">
                          Only {stock} left. Max {stock} per order
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div data-modal-child className="mt-8 hidden md:block">
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className="motion-button flex w-full items-center justify-center gap-3 rounded-[1.35rem] bg-[#171412] px-6 py-5 text-lg font-semibold text-white shadow-[0_18px_42px_rgba(23,20,18,0.22)] transition-all hover:scale-[1.01] hover:bg-black disabled:cursor-not-allowed disabled:bg-neutral-300"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      {isOutOfStock ? 'Out of Stock' : isInCart ? 'Added to Cart' : 'Add to Cart'}
                    </button>

                    <button
                      onClick={handleWishlist}
                      className="flex w-full items-center justify-center gap-3 rounded-[1.35rem] border border-[#e1d5c6] bg-white px-6 py-5 text-lg font-semibold text-[#1f1915] shadow-[0_12px_28px_rgba(24,18,10,0.05)] transition-all hover:-translate-y-0.5 hover:border-[#c8a96a] hover:text-[#a97a2d]"
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current text-[#c39545]' : ''}`} />
                      Add to Wishlist
                    </button>

                    <button
                      onClick={handleWhatsApp}
                      disabled={isOutOfStock}
                      className="motion-button cta-pulse flex w-full items-center justify-center gap-3 rounded-[1.35rem] bg-[linear-gradient(90deg,#c79a47,#ddb362)] px-6 py-5 text-lg font-semibold text-white shadow-[0_18px_42px_rgba(200,169,106,0.28)] transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-neutral-300"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Order via WhatsApp
                    </button>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#e8dfd2] pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {['#d9bf97', '#cfaa7a', '#a37c52'].map(color => (
                          <span
                            key={color}
                            className="h-9 w-9 rounded-full border-2 border-[#f8f6f3]"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-[#54483c]"><span className="font-semibold text-[#1f1915]">Loved by 500+ customers</span></p>
                    </div>
                    <div className="flex flex-wrap items-center gap-5 text-sm text-[#6f6254]">
                      <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#c8a96a]" /> Secure checkout</span>
                      <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-[#c8a96a]" /> Easy returns</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="border-t border-[#e8dfd2] bg-[#f8f6f3]/96 p-4 shadow-[0_-20px_40px_rgba(24,18,10,0.08)] backdrop-blur md:hidden">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-[#6b5f52]">{quantity} item{quantity !== 1 ? 's' : ''}</span>
              <span className="text-lg font-semibold text-[#1f1915]">{money(unitPrice * quantity)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="motion-button flex items-center justify-center gap-2 rounded-[1.2rem] bg-[#171412] px-4 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                onClick={handleWhatsApp}
                disabled={isOutOfStock}
                className="motion-button cta-pulse flex items-center justify-center gap-2 rounded-[1.2rem] bg-[linear-gradient(90deg,#c79a47,#ddb362)] px-4 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-24 right-4 z-[60] rounded-full bg-[#1f1915] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_42px_rgba(23,20,18,0.28)] md:bottom-6 md:right-6">
          {toastMessage}
        </div>
      )}
    </>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import type { CartItem, Product } from '@/types/product'
import { formatCurrency } from '@/lib/currency'
import { productSku, productStock } from '@/lib/productIdentity'

const CART_KEY = 'agh_cart'
const WISHLIST_KEY = 'agh_wishlist'

type Toast = { id: number; message: string }

interface CommerceContextValue {
  cart: CartItem[]
  wishlist: string[]
  cartCount: number
  wishlistCount: number
  isInCart: (productId: string) => boolean
  isWishlisted: (productId: string) => boolean
  addToCart: (product: Product, qty?: number) => void
  setCartQuantity: (productId: string, qty: number, maxStock?: number) => void
  removeFromCart: (productId: string) => void
  toggleWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  moveWishlistToCart: (product: Product) => void
  registerProducts: (products: Product[]) => void
  openMiniCart: () => void
  closeMiniCart: () => void
}

const CommerceContext = createContext<CommerceContextValue | null>(null)

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function normalizeCartItems(items: CartItem[], products: Product[]) {
  const productsByKey = new Map<string, Product>()
  products.forEach(product => {
    productsByKey.set(product.id, product)
    productsByKey.set(productSku(product), product)
  })

  const normalized = new Map<string, CartItem>()
  items.forEach(item => {
    const product = productsByKey.get(item.productId)
    if (!product) return

    const sku = productSku(product)
    const stock = productStock(product)
    if (stock === 0) return

    const existing = normalized.get(sku)
    const qty = Math.min(stock, Math.max(1, item.qty + (existing?.qty || 0)))
    normalized.set(sku, { productId: sku, qty })
  })

  return Array.from(normalized.values())
}

function normalizeWishlistItems(items: string[], products: Product[]) {
  const productsByKey = new Map<string, Product>()
  products.forEach(product => {
    productsByKey.set(product.id, product)
    productsByKey.set(productSku(product), product)
  })

  return Array.from(
    new Set(
      items
        .map(item => productsByKey.get(item))
        .filter((product): product is Product => Boolean(product))
        .map(productSku)
    )
  )
}

function cartItemsEqual(a: CartItem[], b: CartItem[]) {
  return a.length === b.length && a.every((item, index) => item.productId === b[index]?.productId && item.qty === b[index]?.qty)
}

function stringItemsEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((item, index) => item === b[index])
}

export function productPrice(product: Product) {
  return product.discounted_price || product.price
}

export function money(value: number) {
  return formatCurrency(value)
}

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [miniCartOpen, setMiniCartOpen] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [productIndex, setProductIndex] = useState<Record<string, Product>>({})

  useEffect(() => {
    setCart(readJson<CartItem[]>(CART_KEY, []))
    setWishlist(readJson<string[]>(WISHLIST_KEY, []))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart, hydrated])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist, hydrated])

  const notify = useCallback((message: string) => {
    const id = Date.now()
    setToast({ id, message })
    window.setTimeout(() => {
      setToast(current => (current?.id === id ? null : current))
    }, 2300)
  }, [])

  const addToCart = useCallback((product: Product, qty = 1) => {
    const sku = productSku(product)
    const stock = productStock(product)
    if (stock === 0) {
      notify('Out of Stock')
      return
    }

    setProductIndex(current => ({ ...current, [sku]: product, [product.id]: product }))
    setCart(current => {
      const existing = current.find(item => item.productId === sku || item.productId === product.id)
      const requestedQty = Math.max(1, qty)
      const nextQty = Math.min((existing?.qty || 0) + requestedQty, stock)
      if (existing) {
        return [...current.filter(item => item.productId !== sku && item.productId !== product.id), { productId: sku, qty: nextQty }]
      }
      return [...current, { productId: sku, qty: nextQty }]
    })
    setMiniCartOpen(true)
    notify(`${product.name} added to cart`)
  }, [notify])

  const setCartQuantity = useCallback((productId: string, qty: number, maxStock?: number) => {
    const safeQty = Math.max(1, Math.min(qty, maxStock || qty))
    setCart(current => current.map(item => (item.productId === productId ? { ...item, qty: safeQty } : item)))
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart(current => current.filter(item => item.productId !== productId))
    notify('Removed from cart')
  }, [notify])

  const toggleWishlist = useCallback((product: Product) => {
    const sku = productSku(product)
    setWishlist(current => {
      const exists = current.includes(sku)
      notify(exists ? 'Removed from wishlist' : `${product.name} saved`)
      return exists ? current.filter(id => id !== sku) : [...current, sku]
    })
  }, [notify])

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist(current => current.filter(id => id !== productId))
    notify('Removed from wishlist')
  }, [notify])

  const moveWishlistToCart = useCallback((product: Product) => {
    addToCart(product, 1)
    setWishlist(current => current.filter(id => id !== productSku(product)))
  }, [addToCart])

  const registerProducts = useCallback((products: Product[]) => {
    setProductIndex(current => {
      const next = { ...current }
      products.forEach(product => {
        next[productSku(product)] = product
        next[product.id] = product
      })
      return next
    })
    setCart(current => {
      const normalized = normalizeCartItems(current, products)
      return cartItemsEqual(current, normalized) ? current : normalized
    })
    setWishlist(current => {
      const normalized = normalizeWishlistItems(current, products)
      return stringItemsEqual(current, normalized) ? current : normalized
    })
  }, [])

  const openMiniCart = useCallback(() => setMiniCartOpen(true), [])
  const closeMiniCart = useCallback(() => setMiniCartOpen(false), [])

  const value = useMemo<CommerceContextValue>(() => ({
    cart,
    wishlist,
    cartCount: cart.reduce((sum, item) => sum + item.qty, 0),
    wishlistCount: wishlist.length,
    isInCart: productId => cart.some(item => item.productId === productId),
    isWishlisted: productId => wishlist.includes(productId),
    addToCart,
    setCartQuantity,
    removeFromCart,
    toggleWishlist,
    removeFromWishlist,
    moveWishlistToCart,
    registerProducts,
    openMiniCart,
    closeMiniCart,
  }), [addToCart, cart, closeMiniCart, moveWishlistToCart, openMiniCart, registerProducts, removeFromCart, removeFromWishlist, setCartQuantity, toggleWishlist, wishlist])

  return (
    <CommerceContext.Provider value={value}>
      {children}
      <MiniCartDrawer isOpen={miniCartOpen} onClose={() => setMiniCartOpen(false)} productIndex={productIndex} />
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-white shadow-2xl animate-fade-in">
          {toast.message}
        </div>
      )}
    </CommerceContext.Provider>
  )
}

function MiniCartDrawer({
  isOpen,
  onClose,
  productIndex,
}: {
  isOpen: boolean
  onClose: () => void
  productIndex: Record<string, Product>
}) {
  const commerce = useCommerce()

  if (!isOpen) return null

  return (
    <>
      <button className="fixed inset-0 z-[70] bg-black/35 backdrop-blur-sm" onClick={onClose} aria-label="Close cart drawer" />
      <aside className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Mini cart</p>
            <h2 className="font-serif text-2xl font-bold">Your selection</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {commerce.cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-4 h-10 w-10 text-accent" />
              <p className="font-serif text-2xl font-bold">Your cart is empty</p>
              <p className="mt-2 text-sm text-neutral-500">Add a hamper to begin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {commerce.cart.map(item => {
                const product = productIndex[item.productId]

                return (
                <div key={item.productId} className="rounded-xl border border-border p-4">
                  <div className="grid grid-cols-[72px_1fr] gap-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
                      {product?.main_image && (
                        <Image src={product.main_image} alt={product.name} fill className="object-cover" sizes="72px" />
                      )}
                    </div>
                    <div>
                      <p className="font-serif text-lg font-bold">{product?.name || 'Saved product'}</p>
                      <p className="mt-1 text-sm text-accent">{product ? `${money(productPrice(product))} · ${productSku(product)}` : 'Code unavailable'}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-lg border border-border">
                      <button onClick={() => commerce.setCartQuantity(item.productId, item.qty - 1)} className="p-2">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        onClick={() => commerce.setCartQuantity(item.productId, item.qty + 1, product ? productStock(product) : undefined)}
                        disabled={product ? item.qty >= productStock(product) : false}
                        className="p-2 disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button onClick={() => commerce.removeFromCart(item.productId)} className="text-sm text-red-600">
                      Remove
                    </button>
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-border p-5">
          <Link href="/cart" onClick={onClose} className="motion-button block rounded-xl bg-foreground px-5 py-4 text-center font-semibold text-white">
            View Cart
          </Link>
        </div>
      </aside>
    </>
  )
}

export function useCommerce() {
  const context = useContext(CommerceContext)
  if (!context) throw new Error('useCommerce must be used inside CommerceProvider')
  return context
}

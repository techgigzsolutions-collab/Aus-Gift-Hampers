'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CartItem } from '@/types/product'

const CART_KEY = 'agh_cart'
const WISHLIST_KEY = 'agh_wishlist'

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function useLocalCommerce() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

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

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart])

  const addToCart = (productId: string, qty: number, maxStock?: number) => {
    setCart(current => {
      const existing = current.find(item => item.productId === productId)
      const nextQty = Math.max(1, (existing?.qty || 0) + qty)
      const safeQty = typeof maxStock === 'number' ? Math.min(nextQty, maxStock) : nextQty

      if (existing) {
        return current.map(item => (item.productId === productId ? { ...item, qty: safeQty } : item))
      }

      return [...current, { productId, qty: safeQty }]
    })
  }

  const toggleWishlist = (productId: string) => {
    setWishlist(current =>
      current.includes(productId)
        ? current.filter(id => id !== productId)
        : [...current, productId]
    )
  }

  return {
    cart,
    wishlist,
    cartCount,
    wishlistCount: wishlist.length,
    addToCart,
    toggleWishlist,
    isWishlisted: (productId: string) => wishlist.includes(productId),
  }
}

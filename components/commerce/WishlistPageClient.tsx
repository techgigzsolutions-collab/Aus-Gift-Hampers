'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { Heart, ShoppingBag, X } from 'lucide-react'
import type { Product } from '@/types/product'
import { money, productPrice, useCommerce } from '@/components/commerce/CommerceProvider'
import { isLowStock, productSku, productStock } from '@/lib/productIdentity'

export function WishlistPageClient({ products }: { products: Product[] }) {
  const commerce = useCommerce()
  useEffect(() => {
    commerce.registerProducts(products)
  }, [commerce.registerProducts, products])
  const savedProducts = products.filter(product => commerce.wishlist.includes(productSku(product)))

  return (
    <div>
      {savedProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <Heart className="mx-auto mb-5 h-10 w-10 text-accent" />
          <h2 className="font-serif text-3xl font-bold">No saved products yet</h2>
          <p className="mt-3 text-neutral-600">Tap the heart on any hamper to save it here.</p>
          <Link href="/shop" className="motion-button mt-8 inline-flex rounded-xl bg-accent px-6 py-3 font-semibold text-white">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedProducts.map(product => (
            <article key={productSku(product)} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-xl">
              <div className="relative aspect-[4/3] bg-secondary">
                <Image src={product.main_image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                <button onClick={() => commerce.removeFromWishlist(productSku(product))} className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-foreground backdrop-blur hover:text-red-600" aria-label="Remove from wishlist">
                  <X className="h-4 w-4" />
                </button>
                {isLowStock(product) && (
                  <span className="absolute bottom-4 left-4 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white">
                    Only {productStock(product)} left
                  </span>
                )}
                {productStock(product) === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                    <span className="font-semibold text-white">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{product.category}</p>
                <p className="mt-2 text-xs font-semibold text-neutral-500">Code: {productSku(product)}</p>
                <h2 className="mt-2 font-serif text-2xl font-bold">{product.name}</h2>
                <p className="mt-3 text-lg font-bold text-accent">{money(productPrice(product))}</p>
                <button
                  onClick={() => commerce.moveWishlistToCart(product)}
                  disabled={productStock(product) === 0}
                  className="motion-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {productStock(product) === 0 ? 'Out of Stock' : 'Move to cart'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

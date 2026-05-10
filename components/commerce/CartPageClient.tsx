'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { Product } from '@/types/product'
import { money, productPrice, useCommerce } from '@/components/commerce/CommerceProvider'
import { productService } from '@/services/productService'
import { productSku, productStock } from '@/lib/productIdentity'
import { generateWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp'

export function CartPageClient({ products }: { products: Product[] }) {
  const commerce = useCommerce()
  useEffect(() => {
    commerce.registerProducts(products)
  }, [commerce.registerProducts, products])
  const productMap = new Map<string, Product>()
  products.forEach(product => {
    productMap.set(productSku(product), product)
    productMap.set(product.id, product)
  })
  const lines = commerce.cart
    .map(item => ({ item, product: productMap.get(item.productId) }))
    .filter((line): line is { item: typeof commerce.cart[number]; product: Product } => Boolean(line.product))
  const subtotal = lines.reduce((sum, line) => sum + productPrice(line.product) * line.item.qty, 0)

  const handleWhatsAppCheckout = async () => {
    if (lines.length === 0) return

    // Fire stock updates in parallel first
    await Promise.allSettled(
      lines.map(({ item, product }) =>
        productService.updateEnquiredStock(product.id, item.qty)
      )
    )

    // generateWhatsAppMessage reads region at call-time — never stale
    openWhatsApp(() =>
      generateWhatsAppMessage(
        lines.map(({ item, product }) => ({
          id: product.id,
          product_code: productSku(product),
          name: product.name,
          price: productPrice(product),
          quantity: item.qty,
        }))
      )
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {lines.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
            <h2 className="font-serif text-3xl font-bold">Your cart is empty</h2>
            <p className="mt-3 text-neutral-600">Start with a curated hamper from the shop.</p>
            <Link href="/shop" className="motion-button mt-8 inline-flex rounded-xl bg-accent px-6 py-3 font-semibold text-white">
              Shop all
            </Link>
          </div>
        ) : (
          lines.map(({ item, product }) => (
            <article key={item.productId} className="grid gap-5 rounded-2xl border border-border bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr]">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
                <Image src={product.main_image} alt={product.name} fill className="object-cover" sizes="120px" />
              </div>
              <div className="flex flex-col justify-between gap-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{product.category}</p>
                    <h2 className="mt-2 font-serif text-2xl font-bold">{product.name}</h2>
                    <p className="mt-2 text-sm text-neutral-600">{money(productPrice(product))}</p>
                    <p className="mt-1 text-xs font-semibold text-accent">Code: {productSku(product)}</p>
                    <p className={`mt-1 text-xs font-semibold ${productStock(product) <= 5 ? 'text-orange-700' : 'text-neutral-500'}`}>
                      {productStock(product) === 0 ? 'Out of Stock' : `In Stock: ${productStock(product)} items`}
                    </p>
                  </div>
                  <button onClick={() => commerce.removeFromCart(productSku(product))} className="h-10 rounded-full p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600" aria-label="Remove item">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex items-center rounded-xl border border-border">
                    <button onClick={() => commerce.setCartQuantity(productSku(product), item.qty - 1, productStock(product))} className="p-3" aria-label="Decrease quantity">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{item.qty}</span>
                    <button
                      onClick={() => commerce.setCartQuantity(productSku(product), item.qty + 1, productStock(product))}
                      disabled={item.qty >= productStock(product)}
                      className="p-3 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-semibold">{money(productPrice(product) * item.qty)}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="font-serif text-2xl font-bold">Order Summary</h2>
        <div className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Shipping</span>
            <span>{subtotal > 5000 ? 'Free' : 'Calculated at checkout'}</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{money(subtotal)}</span>
          </div>
        </div>
        <button onClick={handleWhatsAppCheckout} disabled={lines.length === 0} className="motion-button mt-6 w-full rounded-xl bg-foreground px-5 py-4 font-semibold text-white disabled:opacity-50">
          Checkout Via WhatsApp
        </button>
      </aside>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  CartItem,
  generateFloatingMessage,
  generateWhatsAppMessage,
  getWhatsAppLink,
} from '@/lib/whatsapp'
import { formatCurrency } from '@/lib/currency'

interface WhatsAppButtonProps {
  cartItems: CartItem[]
}

const WhatsAppIcon = () => (
  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16.02 3.2C9.01 3.2 3.31 8.82 3.31 15.73c0 2.2.59 4.36 1.7 6.24L3.2 28.8l7.03-1.79a12.86 12.86 0 0 0 5.79 1.42c7.01 0 12.71-5.62 12.71-12.53S23.03 3.2 16.02 3.2Zm0 22.99c-1.83 0-3.62-.49-5.18-1.42l-.37-.22-4.17 1.06 1.11-4.04-.24-.39a10.2 10.2 0 0 1-1.6-5.45c0-5.68 4.69-10.29 10.45-10.29s10.45 4.61 10.45 10.29-4.69 10.46-10.45 10.46Zm5.73-7.7c-.31-.16-1.86-.91-2.15-1.01-.29-.11-.5-.16-.71.16-.21.31-.82 1.01-1 1.21-.18.21-.37.23-.68.08-.31-.16-1.32-.48-2.52-1.54-.93-.82-1.56-1.84-1.74-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.11-.21.05-.39-.03-.55-.08-.16-.71-1.69-.97-2.31-.26-.6-.52-.52-.71-.53h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.59 0 1.53 1.13 3.01 1.29 3.22.16.21 2.23 3.36 5.39 4.71.75.32 1.34.51 1.8.65.76.24 1.44.21 1.98.13.61-.09 1.86-.75 2.12-1.48.26-.73.26-1.35.18-1.48-.08-.13-.29-.21-.61-.37Z" />
  </svg>
)

function resolvePageName(pathname: string): string {
  if (pathname === '/') return 'Home'
  const map: Record<string, string> = {
    '/shop': 'Shop',
    '/cart': 'Cart',
    '/wishlist': 'Wishlist',
    '/product': 'Product',
  }
  for (const [key, label] of Object.entries(map)) {
    if (pathname.startsWith(key)) return label
  }
  // Capitalise slug
  const segment = pathname.split('/').filter(Boolean).pop() ?? ''
  return segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function WhatsAppButton({ cartItems }: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  if (cartItems.length === 0) {
    const floatingMsg = generateFloatingMessage(resolvePageName(pathname))
    const emptyLink = getWhatsAppLink(floatingMsg)

    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="whatsapp-float flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_38px_rgba(37,211,102,0.38)] transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Contact us on WhatsApp"
        >
          <WhatsAppIcon />
        </button>

        {isOpen && (
          <div className="absolute bottom-16 right-0 w-72 animate-fade-in rounded-lg bg-white p-4 shadow-xl">
            <p className="mb-3 text-sm text-neutral-600">
              No items in cart yet. Click below to enquire about our collections.
            </p>
            <a
              href={emptyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-accent px-4 py-2 text-center font-semibold text-white transition-colors duration-300 hover:bg-accent-dark"
            >
              Start Chat
            </a>
          </div>
        )}
      </div>
    )
  }

  const message = generateWhatsAppMessage(cartItems)
  const whatsappLink = getWhatsAppLink(message)
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_38px_rgba(37,211,102,0.38)] transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label={`Order on WhatsApp – ${formatCurrency(totalAmount)}`}
      >
        <WhatsAppIcon />
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {cartItems.length}
        </span>
      </a>

      <div className="pointer-events-none absolute bottom-20 right-0 whitespace-nowrap rounded-lg bg-foreground px-3 py-2 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {formatCurrency(totalAmount)} |{' '}
        {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { CartItem, generateWhatsAppMessage, getWhatsAppLink } from '@/lib/whatsapp'

interface WhatsAppButtonProps {
  cartItems: CartItem[]
}

export function WhatsAppButton({ cartItems }: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const message = generateWhatsAppMessage(cartItems)
  const whatsappLink = getWhatsAppLink(message)

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-accent hover:bg-accent-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          aria-label="Contact us on WhatsApp"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.158l-.34-.181-3.52.352 2.381-2.618A9.987 9.987 0 012.5 12.01C2.5 6.485 7.081 2 12.5 2s10 4.485 10 10-4.581 10-10 10c-1.629 0-3.168-.333-4.581-.94l-.356-.187-3.75.736 2.467-3.022z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-72 animate-fade-in">
            <p className="text-sm text-neutral-600 mb-3">No items in cart yet. Click below to inquire about our collections.</p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-2 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Start Chat
            </a>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-14 h-14 rounded-full bg-accent hover:bg-accent-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative"
        aria-label={`Order on WhatsApp - ₹${totalAmount.toLocaleString('en-IN')}`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.158l-.34-.181-3.52.352 2.381-2.618A9.987 9.987 0 012.5 12.01C2.5 6.485 7.081 2 12.5 2s10 4.485 10 10-4.581 10-10 10c-1.629 0-3.168-.333-4.581-.94l-.356-.187-3.75.736 2.467-3.022z" />
        </svg>

        {/* Badge with order count */}
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </a>

      {/* Tooltip */}
      <div className="absolute bottom-20 right-0 bg-foreground text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        ₹{totalAmount.toLocaleString('en-IN')} • {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
      </div>
    </div>
  )
}

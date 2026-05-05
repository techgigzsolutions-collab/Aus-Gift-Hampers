export interface CartItem {
  id: string
  product_code: string
  name: string
  price: number
  quantity: number
}

const FALLBACK_WHATSAPP_NUMBER = '61420272471'

export function getWhatsAppNumber() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || FALLBACK_WHATSAPP_NUMBER
  return raw.replace(/[^\d]/g, '') || FALLBACK_WHATSAPP_NUMBER
}

export function generateWhatsAppMessage(items: CartItem[]): string {
  if (items.length === 0) {
    return 'Hello, I\'m interested in your luxury hamper collection.'
  }

  let message = 'Hello! I\'m interested in ordering the following:\n\n'

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.product_code})\n   Quantity: ${item.quantity}\n   ₹${item.price.toLocaleString('en-IN')} each\n`
  })

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  message += `\nTotal: ₹${total.toLocaleString('en-IN')}\n\n`
  message += 'Please provide more details about delivery and payment options.'

  return message
}

export function getWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodedMessage}`
}

export function getWhatsAppHref(message?: string) {
  const base = `https://wa.me/${getWhatsAppNumber()}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function generateOrderSummary(items: CartItem[]): {
  itemCount: number
  total: number
  items: CartItem[]
} {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    itemCount,
    total,
    items,
  }
}

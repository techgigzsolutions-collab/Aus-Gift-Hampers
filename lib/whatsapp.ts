import { formatCurrency } from '@/lib/currency'
import { getStoredRegion, formatRegion, type UserRegion } from '@/lib/location'

export interface CartItem {
  id: string
  product_code: string
  name: string
  price: number
  quantity: number
}

export interface OrderSummary {
  itemCount: number
  total: number
  items: CartItem[]
}

/* --------------------------------------------------
   CONFIG
-------------------------------------------------- */

export function getWhatsAppNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  return raw.replace(/[^\d]/g, '')
}

/* --------------------------------------------------
   REGION HELPERS  (re-exported for consumers)
-------------------------------------------------- */

export { getStoredRegion, formatRegion }

/* --------------------------------------------------
   LINK HELPERS
-------------------------------------------------- */

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`
}

export function getWhatsAppHref(message?: string): string {
  const base = `https://wa.me/${getWhatsAppNumber()}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

/* --------------------------------------------------
   PRIMARY OPEN HELPER
   Single entry-point for every WhatsApp navigation.
   Message is built lazily inside the click handler
   so getStoredRegion() is always called at click-time.

   Usage:
     onClick={() => openWhatsApp(() => generateWhatsAppMessage(items))}
     onClick={() => openWhatsApp(() => generateGeneralWhatsAppMessage())}
-------------------------------------------------- */

export function openWhatsApp(buildMessage: () => string): void {
  const message = buildMessage()
  const url = getWhatsAppLink(message)
  window.open(url, '_blank', 'noopener,noreferrer')
}

/* --------------------------------------------------
   ORDER SUMMARY
-------------------------------------------------- */

export function generateOrderSummary(items: CartItem[]): OrderSummary {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { itemCount, total, items }
}

/* --------------------------------------------------
   CANONICAL MESSAGE: cart / product order enquiry

   Template (UTF-safe, no copy-pasted emoji bytes):
     *Aus Gift Hampers*
     Luxury Gift Hamper Enquiry

     Hello,

     I would like to order the following:

     - Product Name (SKU-001)
       Quantity: 2
       Price: AUD 120.00

     Total: AUD 240.00

     Customer Location:
     Sydney, NSW, Australia

     Please share delivery details and payment options.

     Thank you.
-------------------------------------------------- */

export function generateWhatsAppMessage(items: CartItem[]): string {
  // Region read at call-time (i.e. on click) — never stale
  const region = getStoredRegion()
  const locationText = formatRegion(region)

  let message =
    '*Aus Gift Hampers*\n' +
    'Luxury Gift Hamper Enquiry\n\n' +
    'Hello,\n\n'

  if (items.length > 0) {
    message += 'I would like to order the following:\n\n'

    items.forEach(item => {
      message +=
        `- ${item.name} (${item.product_code})\n` +
        `  Quantity: ${item.quantity}\n` +
        `  Price: ${formatCurrency(item.price)}\n\n`
    })

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )

    message += `Total: ${formatCurrency(total)}\n\n`
  } else {
    message += 'I am interested in your luxury hamper collection.\n\n'
  }

  message +=
    'Customer Location:\n' +
    `${locationText}\n\n` +
    'Please share delivery details and payment options.\n\n' +
    'Thank you.'

  return message
}

/* --------------------------------------------------
   CANONICAL MESSAGE: general / floating / CTA

   Template:
     *Aus Gift Hampers*
     Luxury Gift Hamper Enquiry

     Hello,

     I would like assistance choosing a gift hamper.

     Customer Location:
     Sydney, NSW, Australia

     Please help me with recommendations based on
     occasion and budget.

     Thank you.
-------------------------------------------------- */

export function generateGeneralWhatsAppMessage(): string {
  const region = getStoredRegion()

  return (
    '*Aus Gift Hampers*\n' +
    'Luxury Gift Hamper Enquiry\n\n' +
    'Hello,\n\n' +
    'I would like assistance choosing a gift hamper.\n\n' +
    'Customer Location:\n' +
    `${formatRegion(region)}\n\n` +
    'Please help me with recommendations based on occasion and budget.\n\n' +
    'Thank you.'
  )
}

/* --------------------------------------------------
   CANONICAL MESSAGE: single product (modal / page)

   Template:
     *Aus Gift Hampers*
     Luxury Gift Hamper Enquiry

     Hello,

     I would like to order:

     - Product Name (SKU-001)
       Quantity: 2
       Price: AUD 120.00
       Delivery: 5-7 business days

     Customer Location:
     Sydney, NSW, Australia

     Please share delivery details and payment options.

     Thank you.
-------------------------------------------------- */

export function generateProductWhatsAppMessage(params: {
  name: string
  sku: string
  quantity: number
  price: number
  delivery?: string
}): string {
  const region = getStoredRegion()

  return (
    '*Aus Gift Hampers*\n' +
    'Luxury Gift Hamper Enquiry\n\n' +
    'Hello,\n\n' +
    'I would like to order:\n\n' +
    `- ${params.name} (${params.sku})\n` +
    `  Quantity: ${params.quantity}\n` +
    `  Price: ${formatCurrency(params.price)}\n` +
    (params.delivery ? `  Delivery: ${params.delivery}\n` : '') +
    '\n' +
    'Customer Location:\n' +
    `${formatRegion(region)}\n\n` +
    'Please share delivery details and payment options.\n\n' +
    'Thank you.'
  )
}

/* --------------------------------------------------
   DEPRECATED ALIASES
   Kept so any import that hasn't been updated yet
   still compiles. Use the canonical functions above.
-------------------------------------------------- */

/** @deprecated Use generateGeneralWhatsAppMessage() */
export function generateFloatingMessage(_pageName?: string): string {
  return generateGeneralWhatsAppMessage()
}

/** @deprecated Use generateProductWhatsAppMessage() */
export function buildLocationBlock(_region?: UserRegion | null): string {
  const r = _region !== undefined ? _region : getStoredRegion()
  return 'Customer Location:\n' + formatRegion(r)
}

/** @deprecated Use generateSingleProductMessage() or generateWhatsAppMessage() */
export function generateSingleProductMessage(item: CartItem): string {
  return generateProductWhatsAppMessage({
    name: item.name,
    sku: item.product_code,
    quantity: item.quantity,
    price: item.price,
  })
}

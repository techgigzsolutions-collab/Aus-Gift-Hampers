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
   ─────────────────────────────────────────────────
   Safari iOS BLOCKS window.open() unless it is the
   *direct synchronous result* of a trusted user tap,
   and even then it often fails for deep-links to
   external apps (WhatsApp, tel:, mailto:).

   The only universally reliable approach on iOS is:
     window.location.href = url          ← same-frame navigation
   or a real <a href> element.

   We use window.location.href here because:
   • It is treated as a user-initiated navigation
   • It works for app deep-links (wa.me) on iOS Safari
   • It is not blocked by Safari's popup blocker
   • It works identically on Chrome iOS, Android, and desktop

   The page will navigate away momentarily but WhatsApp
   will open (or App Store will prompt if not installed)
   and the browser back-button / back-swipe returns the
   user to the page they were on.
   ─────────────────────────────────────────────────
   Usage:
     onClick={() => openWhatsApp(() => generateWhatsAppMessage(items))}
     onClick={() => openWhatsApp(generateGeneralWhatsAppMessage)}
-------------------------------------------------- */

export function openWhatsApp(buildMessage: () => string): void {
  const message = buildMessage()
  const url = getWhatsAppLink(message)
  // window.location.href is the only reliable cross-browser method
  // for deep-link navigation on iOS Safari. Never use window.open()
  // for WhatsApp links — it is silently blocked on Safari.
  window.location.href = url
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
-------------------------------------------------- */

export function generateWhatsAppMessage(items: CartItem[]): string {
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
-------------------------------------------------- */

/** @deprecated Use generateGeneralWhatsAppMessage() */
export function generateFloatingMessage(_pageName?: string): string {
  return generateGeneralWhatsAppMessage()
}

/** @deprecated Use buildLocationBlock() */
export function buildLocationBlock(_region?: UserRegion | null): string {
  const r = _region !== undefined ? _region : getStoredRegion()
  return 'Customer Location:\n' + formatRegion(r)
}

/** @deprecated Use generateProductWhatsAppMessage() */
export function generateSingleProductMessage(item: CartItem): string {
  return generateProductWhatsAppMessage({
    name: item.name,
    sku: item.product_code,
    quantity: item.quantity,
    price: item.price,
  })
}

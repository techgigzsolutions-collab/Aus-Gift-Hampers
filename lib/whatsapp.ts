import { formatCurrency } from '@/lib/currency'
import { getStoredRegion, formatRegionText, type UserRegion } from '@/lib/location'

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

/* -------------------------------- */
/* WHATSAPP CONFIG                  */
/* -------------------------------- */

export function getWhatsAppNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  return raw.replace(/[^\d]/g, '')
}

/* -------------------------------- */
/* REGION HELPERS                   */
/* -------------------------------- */

/** Re-export so consumers only need to import from whatsapp.ts */
export { getStoredRegion, formatRegionText }

/**
 * Returns the formatted location block ready for insertion into
 * a WhatsApp message.  Coordinates are NEVER included.
 */
export function buildLocationBlock(region?: UserRegion | null): string {
  const stored = region !== undefined ? region : getStoredRegion()
  const text = formatRegionText(stored)
  return `📍 Customer Location:\n${text}`
}

/**
 * Appends the location block to any WhatsApp message string.
 */
export function appendRegionToMessage(
  message: string,
  region?: UserRegion | null,
): string {
  return `${message}\n\n${buildLocationBlock(region)}`
}

/* -------------------------------- */
/* ORDER SUMMARY                    */
/* -------------------------------- */

export function generateOrderSummary(items: CartItem[]): OrderSummary {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  return { itemCount, total, items }
}

/* -------------------------------- */
/* WHATSAPP MESSAGE TEMPLATE        */
/* -------------------------------- */

export function generateWhatsAppMessage(items: CartItem[]): string {
  const region = getStoredRegion()

  if (!items.length) {
    return [
      'Hello 👋',
      '',
      'I\'m interested in your premium hamper collection.',
      'Could you please share more details?',
      '',
      buildLocationBlock(region),
    ].join('\n')
  }

  const summary = generateOrderSummary(items)
  const lines: string[] = []

  lines.push('🎁 *Aus Gift Hampers*')
  lines.push('Luxury Gift Hamper Enquiry')
  lines.push('')
  lines.push('Hello 👋')
  lines.push('')
  lines.push('I would like to enquire about the following products:')
  lines.push('')

  summary.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity
    lines.push('━━━━━━━━━━━━━━━')
    lines.push(`*${index + 1}. ${item.name}*`)
    lines.push(`SKU: ${item.product_code}`)
    lines.push(`Quantity: ${item.quantity}`)
    lines.push(`Price: ${formatCurrency(item.price)} each`)
    lines.push(`Subtotal: ${formatCurrency(itemTotal)}`)
    lines.push('')
  })

  lines.push('━━━━━━━━━━━━━━━')
  lines.push('')
  lines.push(`🛍 Total Items: ${summary.itemCount}`)
  lines.push(`💰 Estimated Total: ${formatCurrency(summary.total)}`)
  lines.push('')
  lines.push('Please share:')
  lines.push('• Delivery availability')
  lines.push('• Estimated delivery timeline')
  lines.push('• Payment details')
  lines.push('')
  lines.push(buildLocationBlock(region))
  lines.push('')
  lines.push('Thank you ✨')

  return lines.join('\n')
}

/* -------------------------------- */
/* WHATSAPP LINK GENERATORS         */
/* -------------------------------- */

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`
}

export function getWhatsAppHref(message?: string): string {
  const base = `https://wa.me/${getWhatsAppNumber()}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

/* -------------------------------- */
/* SINGLE PRODUCT MESSAGE           */
/* -------------------------------- */

export function generateSingleProductMessage(item: CartItem): string {
  const region = getStoredRegion()

  return [
    '🎁 *Aus Gift Hampers*',
    '',
    'Hello 👋',
    '',
    'I\'m interested in the following product:',
    '',
    `*${item.name}*`,
    `SKU: ${item.product_code}`,
    `Quantity: ${item.quantity}`,
    `Price: ${formatCurrency(item.price)}`,
    '',
    'Please share more details regarding delivery and availability.',
    '',
    buildLocationBlock(region),
    '',
    'Thank you ✨',
  ].join('\n')
}

/* -------------------------------- */
/* FLOATING / PAGE-CONTEXT MESSAGE  */
/* -------------------------------- */

export function generateFloatingMessage(pageName?: string): string {
  const region = getStoredRegion()
  const pageLabel = pageName || 'Aus Gift Hampers'

  return [
    'Hello, I\'m browsing Aus Gift Hampers.',
    '',
    `Page:\n${pageLabel}`,
    '',
    buildLocationBlock(region),
  ].join('\n')
}

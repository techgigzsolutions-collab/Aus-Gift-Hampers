import type { Product } from '@/types/product'

export const LOW_STOCK_THRESHOLD = 5

export function productSku(product: Product) {
  return product.product_code
}

export function productStock(product: Product) {
  return Math.max(0, Number(product.stock) || 0)
}

export function isLowStock(product: Product) {
  const stock = productStock(product)
  return stock > 0 && stock <= LOW_STOCK_THRESHOLD
}

export function stockLabel(product: Product) {
  const stock = productStock(product)
  if (stock === 0) return 'Out of Stock'
  if (stock <= LOW_STOCK_THRESHOLD) return `Only ${stock} left`
  return `In Stock: ${stock} items`
}

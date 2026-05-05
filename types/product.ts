export interface Product {
  id: string
  product_code: string
  category_code: string | null
  name: string
  category: string
  description: string
  main_image: string
  sub_images: string[]
  price: number
  discounted_price: number | null
  stock: number
  enquired_stock: number
  rating: number | null
  reviews_count: number
  free_shipping: boolean
  estimated_delivery: string
  created_at?: string
  updated_at?: string | null
}

export interface CartItem {
  productId: string
  qty: number
}

export interface WishlistItem {
  productId: string
}

export type ProductPayload = Omit<Product, 'id' | 'product_code' | 'category_code' | 'created_at' | 'updated_at'>

export interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  stock: number
  items: string[]
}

export const products: Product[] = [
  {
    id: 'signature-elegance',
    name: 'Signature Elegance',
    category: 'Premium',
    price: 12500,
    image: '/hamper-1.jpg',
    description: 'A timeless collection of premium chocolates, fine tea, and handcrafted treats',
    stock: 8,
    items: ['Premium Chocolates', 'Jasmine Tea', 'Almond Biscuits', 'Honey Jar', 'Candle'],
  },
  {
    id: 'golden-luxury',
    name: 'Golden Luxury',
    category: 'Premium',
    price: 18900,
    image: '/hamper-2.jpg',
    description: 'Exquisite blend of imported wines, gourmet snacks, and artisanal products',
    stock: 5,
    items: ['Fine Wine', 'Gourmet Cheese', 'Crackers', 'Truffle Oil', 'Chocolate Truffles'],
  },
  {
    id: 'wellness-retreat',
    name: 'Wellness Retreat',
    category: 'Spa',
    price: 9800,
    image: '/hamper-3.jpg',
    description: 'Luxurious spa essentials for ultimate relaxation and pampering',
    stock: 12,
    items: ['Bath Salts', 'Body Lotion', 'Face Mask', 'Aromatherapy Oil', 'Bathrobe'],
  },
  {
    id: 'coffee-connoisseur',
    name: 'Coffee Connoisseur',
    category: 'Gourmet',
    price: 7500,
    image: '/hamper-4.jpg',
    description: 'Premium single-origin coffees and artisanal brewing accessories',
    stock: 15,
    items: ['Ethiopian Coffee', 'Kenyan Coffee', 'Coffee Grinder', 'Pour Over', 'Coffee Beans'],
  },
  {
    id: 'festive-delight',
    name: 'Festive Delight',
    category: 'Seasonal',
    price: 6200,
    image: '/hamper-5.jpg',
    description: 'Perfect for celebrations with assorted sweets and festive treats',
    stock: 20,
    items: ['Dry Fruits', 'Sweets Mix', 'Decorative Candles', 'Gift Tags', 'Ribbon'],
  },
  {
    id: 'artisan-collection',
    name: 'Artisan Collection',
    category: 'Gourmet',
    price: 8900,
    image: '/hamper-6.jpg',
    description: 'Handmade jams, pickles, and artisanal spreads from local makers',
    stock: 10,
    items: ['Berry Jam', 'Pickle Assortment', 'Nut Butter', 'Honey Spread', 'Spice Mix'],
  },
  {
    id: 'luxury-tea-time',
    name: 'Luxury Tea Time',
    category: 'Premium',
    price: 11200,
    image: '/hamper-7.jpg',
    description: 'Curated selection of exotic teas with premium biscuits and treats',
    stock: 9,
    items: ['Oolong Tea', 'Green Tea', 'Herbal Blend', 'Cookies', 'Honey Comb'],
  },
  {
    id: 'chocolate-bliss',
    name: 'Chocolate Bliss',
    category: 'Gourmet',
    price: 5400,
    image: '/hamper-8.jpg',
    description: 'Assorted premium chocolates from around the world in one luxurious box',
    stock: 18,
    items: ['Dark Chocolate', 'Milk Chocolate', 'White Chocolate', 'Chocolate Nibs', 'Cocoa Powder'],
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)))
}

'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { productService } from '@/services/productService'
import type { Product, ProductPayload } from '@/types/product'
import { productSku } from '@/lib/productIdentity'

interface ProductFormProps {
  product: Product | null
  onClose: (changed?: boolean) => void
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    description: product?.description || '',
    main_image: product?.main_image || '',
    price: product?.price?.toString() || '',
    discounted_price: product?.discounted_price?.toString() || '',
    stock: product?.stock?.toString() || '0',
    rating: product?.rating?.toString() || '5',
    reviews_count: product?.reviews_count?.toString() || '0',
    estimated_delivery: product?.estimated_delivery || '5-7 business days',
    free_shipping: product?.free_shipping ?? true,
    featured: product?.featured ?? false,
  })
  const [subImages, setSubImages] = useState<string[]>(product?.sub_images || [])
  const [mainFile, setMainFile] = useState<File | null>(null)
  const [subFiles, setSubFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mainPreview = useMemo(
    () => (mainFile ? URL.createObjectURL(mainFile) : formData.main_image),
    [mainFile, formData.main_image]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const mainImage = mainFile ? await productService.uploadImage(mainFile, 'main') : formData.main_image
      const uploadedSubImages = await Promise.all(subFiles.map(file => productService.uploadImage(file, 'sub')))

      const payload: ProductPayload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        main_image: mainImage,
        sub_images: [...subImages, ...uploadedSubImages],
        price: Number(formData.price),
        discounted_price: formData.discounted_price ? Number(formData.discounted_price) : null,
        stock: Number(formData.stock),
        enquired_stock: product?.enquired_stock || 0,
        rating: formData.rating ? Number(formData.rating) : null,
        reviews_count: Number(formData.reviews_count || 0),
        free_shipping: Boolean(formData.free_shipping),
        featured: Boolean(formData.featured),
        estimated_delivery: formData.estimated_delivery || '5-7 business days',
      }

      if (!payload.name || !payload.category || !payload.main_image || Number.isNaN(payload.price)) {
        throw new Error('Name, category, main image, and price are required.')
      }

      if (product) {
        await productService.updateProduct(product.id, payload)
      } else {
        await productService.createProduct(payload)
      }

      onClose(true)
    } catch (err: any) {
      setError(err.message || 'Unable to save product')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={() => onClose()} className="text-muted-foreground hover:text-foreground text-2xl">
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6">
            <div>
              <div className="relative w-40 h-40 bg-secondary rounded-lg overflow-hidden border border-border">
                {mainPreview ? (
                  <Image src={mainPreview} alt="Main preview" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    Main image
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-foreground mb-2">Main Image Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setMainFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-dark"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-foreground mb-2">Main Image URL</span>
                <input
                  name="main_image"
                  value={formData.main_image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Sub Images Upload</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => setSubFiles(Array.from(e.target.files || []))}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80"
            />
            {subImages.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                {subImages.map((url, index) => (
                  <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
                    <Image src={url} alt={`Sub image ${index + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setSubImages(current => current.filter(item => item !== url))}
                      className="absolute top-1 right-1 bg-white/90 rounded px-1 text-xs"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product && (
              <>
                <label className="block">
                  <span className="block text-sm font-medium text-foreground mb-2">SKU</span>
                  <input
                    value={productSku(product)}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-accent/20 bg-accent/5 px-4 py-2 font-semibold text-accent"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-foreground mb-2">Enquired Stock</span>
                  <input
                    value={product.enquired_stock || 0}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-border bg-secondary/60 px-4 py-2 text-foreground"
                  />
                </label>
              </>
            )}
            {[
              ['name', 'Product Name', 'Premium Wellness Hamper'],
              ['category', 'Category', 'Wellness'],
              ['price', 'Price (AUD)', '5000'],
              ['discounted_price', 'Discounted Price (AUD)', '4500'],
              ['stock', 'Stock', '10'],
              ['rating', 'Rating', '4.8'],
              ['reviews_count', 'Reviews Count', '24'],
              ['estimated_delivery', 'Estimated Delivery', '5-7 business days'],
            ].map(([name, label, placeholder]) => (
              <label key={name} className="block">
                <span className="block text-sm font-medium text-foreground mb-2">{label}</span>
                <input
                  name={name}
                  type={['price', 'discounted_price', 'stock', 'rating', 'reviews_count'].includes(name) ? 'number' : 'text'}
                  step={name === 'rating' ? '0.1' : '1'}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required={['name', 'category', 'price', 'stock'].includes(name)}
                />
              </label>
            ))}
          </div>

          <label className="block">
            <span className="block text-sm font-medium text-foreground mb-2">Description</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              required
            />
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="free_shipping"
              checked={formData.free_shipping}
              onChange={handleChange}
              className="w-5 h-5 accent-[hsl(var(--accent))]"
            />
            <span className="text-sm font-medium text-foreground">Free Shipping</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 accent-[hsl(var(--accent))]"
            />
            <span className="text-sm font-medium text-foreground">Featured Signature Collection</span>
          </label>

          <div className="flex gap-4 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

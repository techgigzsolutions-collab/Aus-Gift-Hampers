import { createClient } from '@/utils/supabase/client'
import type { Product, ProductPayload } from '@/types/product'

export const productService = {
  async getProducts(): Promise<Product[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data || []
  },

  async getProduct(id: string): Promise<Product | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data
  },

  async createProduct(product: ProductPayload) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()

    if (error) {
      throw error
    }

    return data?.[0]
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const supabase = createClient()
    const { id: _id, product_code: _productCode, category_code: _categoryCode, created_at: _createdAt, ...safeUpdates } = updates
    const { data, error } = await supabase
      .from('products')
      .update({ ...safeUpdates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) {
      throw error
    }

    return data?.[0]
  },

  async deleteProduct(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  },

  async updateEnquiredStock(id: string, quantity: number) {
    const supabase = createClient()
    const { error } = await supabase.rpc('increment_enquired_stock', {
      product_id: id,
      quantity,
    })

    if (error) throw error
  },

  async uploadImage(file: File, folder = 'catalog'): Promise<string> {
    const supabase = createClient()
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')
    const fileName = `${folder}/${crypto.randomUUID()}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: publicData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    return publicData.publicUrl
  },
}

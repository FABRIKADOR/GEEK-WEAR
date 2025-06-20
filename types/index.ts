export type User = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  is_visible?: boolean
  created_at: string
  updated_at: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number
  category_id: string
  franchises_ids?: string[]
  featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ProductWithDetails = Product & {
  category: Category
  images: ProductImage[]
  variants: ProductVariant[]
  tags: Tag[]
  franchises?: Franchise[]
}

export type ProductImage = {
  id: string
  product_id: string
  url: string
  alt_text?: string
  is_primary: boolean
  display_order: number
  created_at: string
}

export type ProductVariant = {
  id: string
  product_id: string
  sku: string
  size: string
  color: string
  weight?: number
  dimensions?: string
  price_adjustment: number
  stock_quantity: number
  created_at: string
  updated_at: string
}

export type Tag = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type Franchise = {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export type CartItem = {
  id: string
  product_id: string
  variant_id?: string
  quantity: number
  product: Product
  variant?: ProductVariant
}

export type Cart = {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
}

export type OrderStatus = {
  id: string
  name: string
  description?: string
  color: string
}

export type Order = {
  id: string
  user_id: string
  order_number: string
  status_id: string
  subtotal: number
  discount?: number
  total: number
  coupon_id?: string
  shipping_address_id: string
  billing_address_id: string
  shipping_cost: number
  shipping_method: string
  tracking_number?: string
  notes?: string
  payment_status: string
  created_at: string
  updated_at: string
  status?: OrderStatus
  items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  variant_id?: string
  quantity: number
  price: number
  total: number
  product?: Product
  variant?: ProductVariant
}

export type Address = {
  id: string
  user_id: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export type Coupon = {
  id: string
  code: string
  description?: string
  discount_type: string
  discount_value: number
  minimum_purchase?: number
  usage_limit?: number
  usage_count: number
  is_active: boolean
  start_date: string
  end_date?: string
  created_at: string
  updated_at: string
}

export type ProductReview = {
  id: string
  product_id: string
  user_id: string
  rating: number
  title?: string
  content: string
  is_verified_purchase: boolean
  is_approved: boolean
  created_at: string
  updated_at: string
  user?: {
    full_name?: string
    email: string
  }
}

export type WishlistItem = {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: ProductWithDetails
}

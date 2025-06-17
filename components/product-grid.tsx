"use client"

import ProductCard from "./product-card"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price?: number
  image_url?: string
  images?: Array<{ url: string; is_primary?: boolean }>
  categories?: { name: string }
}

interface ProductGridProps {
  products: Product[]
  featured?: boolean
  title?: string
  description?: string
  showViewAll?: boolean
}

export default function ProductGrid({
  products,
  featured = false,
  title,
  description,
  showViewAll = false,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No hay productos disponibles</h3>
        <p className="text-muted-foreground mt-2">Vuelve pronto para ver nuevos productos</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">{title}</h2>
            {description && <p className="text-muted-foreground mt-2">{description}</p>}
          </div>
          {showViewAll && <button className="text-purple-600 hover:text-purple-700 font-medium">Ver Todos</button>}
        </div>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} featured={featured} />
        ))}
      </div>
    </div>
  )
}

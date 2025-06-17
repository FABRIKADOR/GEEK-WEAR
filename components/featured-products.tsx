"use client"

import FeaturedProductsCarousel from "./featured-products-carousel"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price?: number
  image_url?: string
  images?: Array<{ url: string; is_primary?: boolean }>
  categories?: { name: string }
  featured?: boolean
}

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  console.log("Total featured products received:", products.length)
  console.log(
    "Products data:",
    products.map((p) => ({ name: p.name, featured: p.featured })),
  )

  // Ya vienen filtrados desde la base de datos, pero por seguridad verificamos
  const featuredProducts = products.filter((product) => product.featured === true)

  console.log("Final featured products to show:", featuredProducts.length)

  // Si no hay productos destacados, mostrar mensaje
  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <div className="w-full px-4 py-8 sm:py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">Productos Destacados</h2>
          <p className="text-sm sm:text-base text-white/80 px-2">
            No hay productos destacados disponibles en este momento
          </p>
        </div>
      </div>
    )
  }

  return <FeaturedProductsCarousel products={featuredProducts} />
}

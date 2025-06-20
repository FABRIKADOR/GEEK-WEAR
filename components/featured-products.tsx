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
  console.log("=== FEATURED PRODUCTS DEBUG ===")
  console.log("Total products received:", products?.length || 0)
  console.log("Products array:", products)

  if (!products || products.length === 0) {
    console.log("No products received at all")
    return (
      <div className="w-full px-4 py-8 sm:py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">Últimos Lanzamientos</h2>
          <p className="text-sm sm:text-base text-white/80 px-2">Cargando productos...</p>
        </div>
      </div>
    )
  }

  console.log("Total products received:", products.length)
  console.log(
    "Products data:",
    products.map((p) => ({ name: p.name, featured: p.featured })),
  )

  // Si no hay productos destacados, mostrar los primeros 6 productos disponibles
  let productsToShow = products.filter((product) => product.featured === true)

  if (productsToShow.length === 0) {
    console.log("No featured products found, showing first 6 products")
    productsToShow = products.slice(0, 6)
  }

  console.log("Final products to show:", productsToShow.length)

  // Si no hay productos en absoluto, mostrar mensaje
  if (!productsToShow || productsToShow.length === 0) {
    return (
      <div className="w-full px-4 py-8 sm:py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">Últimos Lanzamientos</h2>
          <p className="text-sm sm:text-base text-white/80 px-2">Descubre los juegos más recientes</p>
        </div>
      </div>
    )
  }

  return <FeaturedProductsCarousel products={productsToShow} />
}

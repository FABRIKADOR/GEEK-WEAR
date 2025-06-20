"use client"

import ProductCard from "./product-card"

const mockProducts = [
  {
    id: "1",
    name: "Elden Ring",
    slug: "elden-ring",
    price: 59.99,
    compare_at_price: 79.99,
    image_url: "/placeholder.svg?height=300&width=200&text=Elden+Ring",
    categories: { name: "Juegos" },
    featured: true,
  },
  {
    id: "2",
    name: "God of War",
    slug: "god-of-war",
    price: 49.99,
    image_url: "/placeholder.svg?height=300&width=200&text=God+of+War",
    categories: { name: "Juegos" },
    featured: true,
  },
  {
    id: "3",
    name: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    price: 39.99,
    compare_at_price: 59.99,
    image_url: "/placeholder.svg?height=300&width=200&text=Cyberpunk+2077",
    categories: { name: "Juegos" },
    featured: true,
  },
]

export default function ProductsFallback() {
  return (
    <div className="w-full px-4 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">Últimos Lanzamientos</h2>
          <p className="text-sm sm:text-base text-white/80 px-2">Descubre los juegos más recientes</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

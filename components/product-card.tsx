"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

export default function ProductCard({ product, featured = false }) {
  // Encontrar la imagen principal o usar la primera disponible
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.is_primary) || product.images[0]
      : null

  const imageUrl = primaryImage?.url || product.image_url || "/placeholder.svg?height=300&width=300"

  // Calcular descuento si existe
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercentage = hasDiscount ? Math.round((1 - product.price / product.compare_at_price) * 100) : 0

  // Obtener categoría
  const categoryName = product.category?.name || product.categories?.name || "Camisetas"

  return (
    <Card className="overflow-hidden h-full bg-white rounded-lg flex flex-col">
      <div className="relative">
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden">
            <Image src={imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
        </Link>

        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      <div className="p-4 bg-purple-700 text-white flex-1 flex flex-col">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-xl mb-3 h-16 line-clamp-2 flex items-start leading-tight">{product.name}</h3>
        </Link>

        <div className="text-sm text-sky-300 mb-3">{categoryName}</div>

        <div className="flex items-center space-x-2 mb-4">
          <span className="font-bold text-xl">${product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-purple-300 line-through text-sm">${product.compare_at_price.toFixed(2)}</span>
          )}
        </div>

        <div className="mt-auto">
          <Link href={`/product/${product.slug}`}>
            <Button variant="secondary" className="w-full bg-white text-purple-700 hover:bg-gray-100">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Ver Producto
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

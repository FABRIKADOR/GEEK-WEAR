"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Download, Crown, Zap } from "lucide-react"

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
  const categoryName = product.category?.name || product.categories?.name || "Juegos"

  // Determinar tipo de producto
  const isDigital = categoryName.toLowerCase().includes("digital") || categoryName.toLowerCase().includes("membresía")
  const isPremium = product.featured || categoryName.toLowerCase().includes("premium")

  return (
    <Card className="overflow-hidden h-full bg-midnight-blue/80 backdrop-blur-sm border-cyber-blue/30 rounded-lg flex flex-col hover:shadow-lg hover:shadow-cyber-blue/20 transition-all duration-300 hover:scale-105">
      <div className="relative">
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-slate/60 via-transparent to-transparent"></div>
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isPremium && (
            <div className="bg-gradient-to-r from-gaming-orange to-plasma-pink text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Crown className="w-3 h-3" />
              PREMIUM
            </div>
          )}
          {isDigital && (
            <div className="bg-gradient-to-r from-cyber-blue to-neon-green text-dark-slate text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Download className="w-3 h-3" />
              DIGITAL
            </div>
          )}
        </div>

        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-plasma-pink to-gaming-orange text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      <div className="p-4 bg-gradient-to-b from-midnight-blue to-dark-slate text-white flex-1 flex flex-col">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-xl mb-3 h-16 line-clamp-2 flex items-start leading-tight hover:text-cyber-blue transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="text-sm text-neon-green mb-3 font-medium">{categoryName}</div>

        <div className="flex items-center space-x-2 mb-4">
          <span className="font-bold text-xl text-cyber-blue">${product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-gray-400 line-through text-sm">${product.compare_at_price.toFixed(2)}</span>
          )}
        </div>

        <div className="mt-auto">
          <Link href={`/product/${product.slug}`}>
            <Button
              variant="secondary"
              className="w-full bg-gradient-to-r from-cyber-blue to-neon-green text-dark-slate hover:from-neon-green hover:to-cyber-blue font-bold transition-all duration-300 hover:shadow-lg hover:shadow-cyber-blue/30"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isDigital ? "Comprar Ahora" : "Ver Juego"}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

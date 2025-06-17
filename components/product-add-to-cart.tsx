"use client"

import { useState } from "react"
import { ShoppingCart, Minus, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCartStore } from "@/lib/cart"
import { useCartSidebar } from "@/hooks/use-cart-sidebar"
import type { ProductWithDetails, ProductVariant } from "@/types"

interface ProductAddToCartProps {
  product: ProductWithDetails
}

export function ProductAddToCart({ product }: ProductAddToCartProps) {
  const { toast } = useToast()
  const addItem = useCartStore((state) => state.addItem)
  const { openCart } = useCartSidebar()

  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.length > 0 ? product.variants[0] : undefined,
  )

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants?.find((v) => v.id === variantId)
    setSelectedVariant(variant)
  }

  const handleAddToCart = async () => {
    setIsAdding(true)

    // Simular un pequeño delay para la animación
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Agregar al carrito
    addItem(product, quantity, selectedVariant)

    // Crear ID único para el item
    const itemId = `${product.id}-${Date.now()}`

    // Mostrar toast con animación
    toast({
      title: "¡Agregado al carrito! ✨",
      description: `${quantity} × ${product.name} agregado exitosamente`,
      duration: 2000,
    })

    // Abrir carrito sidebar con el ID del item
    openCart(itemId)

    setIsAdding(false)
  }

  // Group variants by size and color if they exist
  const sizes = product.variants ? [...new Set(product.variants.map((v) => v.size).filter(Boolean))] : []
  const colors = product.variants ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))] : []

  return (
    <div className="space-y-6">
      {/* Variantes */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-4">
          {sizes.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="size" className="text-sm font-medium text-gray-700">
                Talla
              </Label>
              <Select
                value={selectedVariant?.size || ""}
                onValueChange={(size) => {
                  const newVariant = product.variants?.find(
                    (v) => v.size === size && (!selectedVariant || v.color === selectedVariant.color),
                  )
                  if (newVariant) {
                    handleVariantChange(newVariant.id)
                  }
                }}
              >
                <SelectTrigger
                  id="size"
                  className="border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-200"
                >
                  <SelectValue placeholder="Selecciona una talla" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {colors.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm font-medium text-gray-700">
                Color
              </Label>
              <Select
                value={selectedVariant?.color || ""}
                onValueChange={(color) => {
                  const newVariant = product.variants?.find(
                    (v) => v.color === color && (!selectedVariant || v.size === selectedVariant.size),
                  )
                  if (newVariant) {
                    handleVariantChange(newVariant.id)
                  }
                }}
              >
                <SelectTrigger
                  id="color"
                  className="border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-200"
                >
                  <SelectValue placeholder="Selecciona un color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Selector de Cantidad */}
      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Cantidad
        </Label>
        <div className="flex items-center justify-center space-x-4 bg-gray-50 rounded-xl p-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-red-100 hover:text-red-600 transition-all duration-200"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="flex-1 text-center">
            <span className="text-2xl font-bold text-purple-600">{quantity}</span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-green-100 hover:text-green-600 transition-all duration-200"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Botón Add to Cart */}
      <Button
        className={`
          w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
          text-white py-4 text-lg font-bold rounded-xl transition-all duration-300 
          hover:scale-105 hover:shadow-xl active:scale-95 relative overflow-hidden
          ${isAdding ? "animate-pulse" : ""}
        `}
        onClick={handleAddToCart}
        disabled={selectedVariant ? selectedVariant.stock_quantity < quantity : false || isAdding}
        size="lg"
      >
        <div className="flex items-center justify-center space-x-3">
          {isAdding ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Agregando...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>Agregar al Carrito</span>
              <Sparkles className="h-5 w-5 animate-pulse" />
            </>
          )}
        </div>

        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
      </Button>

      {/* Advertencia de stock bajo */}
      {selectedVariant && selectedVariant.stock_quantity < 5 && selectedVariant.stock_quantity > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
          <p className="text-sm text-yellow-700 font-medium">
            ⚠️ ¡Solo quedan {selectedVariant.stock_quantity} en stock!
          </p>
        </div>
      )}

      {selectedVariant && selectedVariant.stock_quantity === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-sm text-red-700 font-bold">❌ Agotado</p>
        </div>
      )}
    </div>
  )
}

// Exportación por defecto para compatibilidad
export default ProductAddToCart

"use client"

import { useEffect, useState } from "react"
import { X, ShoppingBag, Minus, Plus, Trash2, Gift, Sparkles, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/cart"
import { useCartSidebar } from "@/hooks/use-cart-sidebar"
import Link from "next/link"

export function CartSidebar() {
  const { isOpen, closeCart, justAdded, clearJustAdded } = useCartSidebar()
  const cart = useCartStore((state) => state.cart)
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  const [showSuccess, setShowSuccess] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(false)

  // Mostrar mensaje de éxito cuando se agrega un item
  useEffect(() => {
    if (justAdded) {
      setShowSuccess(true)
      const timer = setTimeout(() => {
        setShowSuccess(false)
        clearJustAdded()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [justAdded, clearJustAdded])

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, closeCart])

  const subtotal = cart.subtotal || 0
  const shipping = subtotal > 50 ? 0 : 3.44
  const discount = appliedCoupon ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "geek10") {
      setAppliedCoupon(true)
      setCouponCode("")
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay con animación */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 
          transform transition-all duration-300 ease-out flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header con gradiente */}
        <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

          <div className="relative flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <ShoppingBag className="h-7 w-7" />
                <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Tu Carrito</h2>
                <p className="text-purple-100 text-sm">
                  {cart.items.length} {cart.items.length === 1 ? "producto" : "productos"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCart}
              className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Success Message con animación */}
        {showSuccess && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 transform transition-all duration-300 slide-in-from-top">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">¡Producto agregado!</p>
                <p className="text-sm text-green-100">Tu producto se agregó exitosamente al carrito</p>
              </div>
            </div>
          </div>
        )}

        {/* Free shipping banner */}
        {subtotal > 0 && subtotal < 50 && (
          <div className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-3 text-center">
            <p className="text-sm font-medium">¡Agrega ${(50 - subtotal).toFixed(2)} más para envío GRATIS! 🚚</p>
          </div>
        )}

        {subtotal >= 50 && (
          <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-3 text-center">
            <p className="text-sm font-medium flex items-center justify-center space-x-2">
              <Gift className="h-4 w-4" />
              <span>¡Felicidades! Tienes envío GRATIS 🎉</span>
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-purple-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500 mb-6">¡Descubre productos increíbles y comienza a comprar!</p>
              <Button
                onClick={closeCart}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105"
              >
                Explorar Productos
              </Button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cart.items.map((item, index) => {
                const itemPrice = item.product.price + (item.variant?.price_adjustment || 0)
                const itemTotal = itemPrice * item.quantity

                // Verificar si es un item nuevo de forma más segura
                const isNewItem =
                  justAdded &&
                  typeof justAdded === "string" &&
                  (item.id.includes(justAdded) || justAdded.includes(item.product.id))

                return (
                  <div
                    key={item.id}
                    className={`
                      group relative bg-white border-2 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg
                      ${
                        isNewItem
                          ? "border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 scale-[1.02]"
                          : "border-gray-100 hover:border-purple-200"
                      }
                    `}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {isNewItem && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        ¡Nuevo!
                      </Badge>
                    )}

                    <div className="flex items-center space-x-4">
                      {/* Image */}
                      <div className="relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0].url || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-purple-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors duration-200">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            ${itemTotal.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">${itemPrice.toFixed(2)} c/u</span>
                        </div>
                        {item.variant && (
                          <div className="flex space-x-2 mt-1">
                            {item.variant.size && (
                              <Badge variant="secondary" className="text-xs">
                                {item.variant.size}
                              </Badge>
                            )}
                            {item.variant.color && (
                              <Badge variant="secondary" className="text-xs">
                                {item.variant.color}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-1 bg-gray-50 rounded-full p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                            onClick={() => updateItemQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-bold text-purple-600">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-green-100 hover:text-green-600 transition-all duration-200"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 hover:scale-110"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t bg-gradient-to-b from-gray-50 to-white p-6 space-y-6">
            {/* Coupon Code */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Gift className="h-4 w-4" />
                <span>¿Tienes un código de descuento?</span>
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Ingresa tu código aquí"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-200"
                  disabled={appliedCoupon}
                />
                <Button
                  onClick={applyCoupon}
                  disabled={!couponCode || appliedCoupon}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  Aplicar
                </Button>
              </div>
              {appliedCoupon && (
                <div className="flex items-center space-x-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>¡Código aplicado! 10% de descuento</span>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}>
                  {shipping === 0 ? "GRATIS" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento (10%)</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 rounded-xl font-medium"
                onClick={closeCart}
              >
                Seguir Comprando
              </Button>
              <Link href="/checkout" onClick={closeCart}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg">
                  <span className="flex items-center justify-center space-x-2">
                    <span>Proceder al Checkout</span>
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Exportación por defecto para compatibilidad
export default CartSidebar

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/cart"
import { useToast } from "@/components/ui/use-toast"

export default function CartPage() {
  const { toast } = useToast()
  const cart = useCartStore((state) => state.cart)
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const applyCoupon = useCartStore((state) => state.applyCoupon)
  const removeCoupon = useCartStore((state) => state.removeCoupon)

  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del carrito",
      })
    } else {
      updateItemQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado del carrito",
    })
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsApplyingCoupon(true)

    // Simular validación de cupón
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Ejemplo: aplicar 10% de descuento si el código es "DESCUENTO10"
    if (couponCode.toUpperCase() === "DESCUENTO10") {
      const discount = cart.subtotal * 0.1
      applyCoupon(discount)
      toast({
        title: "Cupón aplicado",
        description: `Descuento de $${discount.toFixed(2)} aplicado`,
      })
      setCouponCode("")
    } else {
      toast({
        title: "Cupón inválido",
        description: "El código de cupón no es válido",
        variant: "destructive",
      })
    }

    setIsApplyingCoupon(false)
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    toast({
      title: "Cupón removido",
      description: "El descuento ha sido removido",
    })
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">Parece que no has agregado ningún producto a tu carrito todavía.</p>
          <Link href="/products">
            <Button size="lg">Continuar Comprando</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items del carrito */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const itemPrice = item.product.price + (item.variant?.price_adjustment || 0)
            const itemTotal = itemPrice * item.quantity

            return (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Imagen del producto */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0].url || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      {item.variant && (
                        <div className="text-sm text-gray-600 mt-1">
                          {item.variant.size && <span>Talla: {item.variant.size}</span>}
                          {item.variant.size && item.variant.color && <span> • </span>}
                          {item.variant.color && <span>Color: {item.variant.color}</span>}
                        </div>
                      )}
                      <div className="text-lg font-semibold mt-2">
                        ${itemPrice.toFixed(2)}
                        {item.variant?.price_adjustment !== 0 && (
                          <span className="text-sm text-gray-500 ml-2">
                            (${item.product.price.toFixed(2)} + ${item.variant?.price_adjustment.toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = Number.parseInt(e.target.value) || 1
                          handleQuantityChange(item.id, newQuantity)
                        }}
                        className="h-8 w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Total del item */}
                    <div className="text-right">
                      <div className="font-semibold text-lg">${itemTotal.toFixed(2)}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Botón para limpiar carrito */}
          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Vaciar Carrito
            </Button>
            <Link href="/products">
              <Button variant="outline">Continuar Comprando</Button>
            </Link>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Código de cupón */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Código de Cupón</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ingresa tu código"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isApplyingCoupon}
                  />
                  <Button onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponCode.trim()} size="sm">
                    {isApplyingCoupon ? "..." : "Aplicar"}
                  </Button>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600">Descuento aplicado</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-700 h-auto p-0"
                    >
                      Remover
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Totales */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-${cart.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>Calculado en checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botón de checkout */}
              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  Proceder al Checkout
                </Button>
              </Link>

              {/* Información adicional */}
              <div className="text-sm text-gray-600 text-center">
                <p>Envío gratuito en pedidos superiores a $50</p>
                <p className="mt-1">Devoluciones gratuitas dentro de 30 días</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

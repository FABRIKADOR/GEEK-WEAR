"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, Package, MapPin, CreditCard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { orderService } from "@/services/order-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shippingInfo, setShippingInfo] = useState<any>({})
  const [paymentInfo, setPaymentInfo] = useState<any>({})

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        router.push("/auth/login")
        return
      }

      try {
        setIsLoading(true)
        const orderData = await orderService.getOrderById(params.id)

        if (!orderData || orderData.user_id !== user.id) {
          router.push("/account/orders")
          return
        }

        // Intentar recuperar la información de envío y pago del localStorage
        const lastOrder = localStorage.getItem("lastOrder")
        if (lastOrder) {
          const parsedOrder = JSON.parse(lastOrder)
          if (parsedOrder.orderNumber === orderData.order_number) {
            setShippingInfo(parsedOrder.shippingInfo || {})
            setPaymentInfo(parsedOrder.paymentInfo || {})
          }
        }

        setOrder(orderData)
      } catch (error) {
        console.error("Error al cargar orden:", error)
        router.push("/account/orders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, user, router])

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account/orders">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a Pedidos
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Pedido #{order.order_number}</h2>
          <p className="text-muted-foreground">Realizado el {formatDate(order.created_at)}</p>
        </div>
        <Badge
          className={`${
            order.status_id === "processing"
              ? "bg-yellow-100 text-yellow-800"
              : order.status_id === "shipped"
                ? "bg-blue-100 text-blue-800"
                : order.status_id === "delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
          } hover:bg-opacity-90 px-3 py-1 text-sm`}
        >
          {order.status_id || "Procesando"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
              {order.items && order.items.length > 0 ? (
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          <Image
                            src={`/placeholder.svg?height=64&width=64&text=Producto`}
                            alt="Producto"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">Producto ID: {item.product_id}</h4>
                              {item.variant_id && (
                                <p className="text-sm text-muted-foreground">Variante ID: {item.variant_id}</p>
                              )}
                            </div>
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                            <p className="text-sm font-medium">Total: ${item.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay productos en este pedido.</p>
              )}
            </CardContent>
          </Card>

          {Object.keys(shippingInfo).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Información de Envío</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {shippingInfo.firstName} {shippingInfo.lastName}
                    </p>
                    <p>{shippingInfo.address}</p>
                    <p>
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}
                    </p>
                    <p>{shippingInfo.country}</p>
                    <p className="text-sm text-muted-foreground mt-2">Teléfono: {shippingInfo.phone}</p>
                    <p className="text-sm text-muted-foreground">Email: {shippingInfo.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>${order.shipping_cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t mt-2">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.keys(paymentInfo).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Tarjeta de Crédito</p>
                    <p className="text-sm">{paymentInfo.cardNumber}</p>
                    <p className="text-sm text-muted-foreground">{paymentInfo.cardName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Método de Envío</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{order.shipping_method}</p>
                  <p className="text-sm text-muted-foreground">Costo de envío: ${order.shipping_cost.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

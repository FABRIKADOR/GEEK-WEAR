"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { orderService } from "@/services/order-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { ShoppingBag, Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        router.push("/auth/login")
        return
      }

      try {
        setIsLoading(true)
        const userOrders = await orderService.getUserOrders(user.id)
        setOrders(userOrders)
      } catch (error) {
        console.error("Error al cargar órdenes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, router])

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Mis Pedidos</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="pt-3 flex justify-end">
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mis Pedidos</h2>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-grape/10 to-dark-blue/10 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-grape" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No has realizado ningún pedido todavía</h3>
            <p className="text-muted-foreground mb-6">Cuando realices un pedido, aparecerá aquí</p>
            <Button asChild className="bg-grape hover:bg-dark-blue">
              <Link href="/products">Empezar a Comprar</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-all">
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <CardTitle className="text-lg">Pedido #{order.order_number}</CardTitle>
                    <CardDescription>Realizado el {formatDate(order.created_at)}</CardDescription>
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
                    } hover:bg-opacity-90 self-start`}
                  >
                    {order.status_id || "Procesando"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{order.items?.length || 0} productos</p>
                      <p className="text-sm text-muted-foreground">Método de envío: {order.shipping_method}</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm pt-3 border-t">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/account/orders/${order.id}`}>Ver Detalles</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, Package, ArrowRight, Calendar, MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<string>("pending")

  // Parámetros de MercadoPago
  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")
  const externalReference = searchParams.get("external_reference")
  const merchantOrderId = searchParams.get("merchant_order_id")

  useEffect(() => {
    // Verificar el estado del pago si viene de MercadoPago
    if (paymentId && status) {
      checkPaymentStatus()
    }

    // Get order from local storage
    const storedOrder = localStorage.getItem("lastOrder")
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder))
    } else if (!paymentId) {
      // If no order found and not coming from MercadoPago, redirect to home
      router.push("/")
    }
  }, [paymentId, status, router])

  const checkPaymentStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      const response = await fetch(
        `/api/payments/status?payment_id=${paymentId}&status=${status}&external_reference=${externalReference}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (data.success) {
        setPaymentStatus(data.payment.status)

        if (data.payment.status === "approved") {
          toast({
            title: "¡Pago aprobado!",
            description: "Tu pago ha sido procesado exitosamente.",
          })
        } else if (data.payment.status === "pending") {
          toast({
            title: "Pago pendiente",
            description: "Tu pago está siendo procesado.",
            variant: "default",
          })
        } else {
          toast({
            title: "Problema con el pago",
            description: "Hubo un problema con tu pago. Contacta al soporte.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error)
    }
  }

  if (!order && !paymentId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
        <p className="mt-4">Cargando información del pedido...</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Procesando</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">
            {paymentStatus === "approved" ? "¡Pago Completado!" : "¡Pedido Recibido!"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {paymentStatus === "approved"
              ? "Tu pago ha sido procesado exitosamente."
              : "Hemos recibido tu pedido y estamos procesando el pago."}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Pedido #{externalReference || order?.orderNumber}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {formatDate(order?.date || new Date().toISOString())}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                <span className="font-medium">Estado del Pedido:</span>
              </div>
              {getStatusBadge(paymentStatus)}
            </div>

            {paymentId && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">ID de Pago:</span>
                </div>
                <span className="font-mono text-sm">{paymentId}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <span className="font-medium">Fecha estimada de entrega:</span>
              </div>
              <span>{formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString())}</span>
            </div>

            {order?.shippingInfo && (
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary mt-0.5" />
                <div>
                  <span className="font-medium">Dirección de envío:</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                    <br />
                    {order.shippingInfo.address}
                    <br />
                    {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}
                    <br />
                    {order.shippingInfo.country}
                  </p>
                </div>
              </div>
            )}

            {order?.items && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-4">Productos</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border">
                          <Image
                            src={
                              item.product.images && item.product.images[0]?.url
                                ? item.product.images[0].url
                                : `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(item.product.name)}`
                            }
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{item.product.name}</h4>
                              {item.variant && (
                                <p className="text-sm text-muted-foreground">
                                  {item.variant.size} / {item.variant.color}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                            </div>
                            <p className="font-medium">
                              {formatPrice(
                                (item.product.price + (item.variant?.price_adjustment || 0)) * item.quantity,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span>{formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/account/orders">Ver mis pedidos</Link>
            </Button>
            <Button asChild>
              <Link href="/">
                Continuar comprando
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Recibirás un correo electrónico de confirmación con los detalles de tu pedido.</p>
          {paymentStatus === "pending" && (
            <p className="mt-2 text-yellow-600">Tu pago está siendo procesado. Te notificaremos cuando sea aprobado.</p>
          )}
          <p className="mt-2">
            Si tienes alguna pregunta sobre tu pedido, por favor{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contáctanos
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

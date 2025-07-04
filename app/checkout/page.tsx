"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/cart"
import { CheckoutSummary } from "@/components/checkout-summary"
import { CheckoutForm } from "@/components/checkout-form"
import { ShippingMethod } from "@/components/shipping-method"
import { MercadoPagoButton } from "@/components/mercadopago-button"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import supabase from "@/lib/supabase"
import { orderService } from "@/services/order-service"

const CHECKOUT_STEPS = ["shipping", "payment", "review"]

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cart, clearCart } = useCartStore()
  const [activeStep, setActiveStep] = useState("shipping")
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    saveAddress: false,
  })
  const [shippingMethod, setShippingMethod] = useState({
    id: "standard",
    name: "Envío Estándar",
    price: 99,
    estimatedDelivery: "5-7 días hábiles",
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  // Verificar si el usuario está logueado y tiene productos en el carrito
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true)

      if (cart.items.length === 0) {
        router.push("/cart")
        return
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          toast({
            title: "Inicia sesión",
            description: "Debes iniciar sesión para completar tu compra",
            variant: "destructive",
          })

          // Guardar URL actual para redirección
          localStorage.setItem("redirectAfterLogin", "/checkout")

          router.push("/auth/login")
          return
        }

        console.log("Usuario autenticado:", user.email)
        setUser(user)
      } catch (error) {
        console.error("Error verificando sesión:", error)
        toast({
          title: "Error",
          description: "Hubo un problema al verificar tu sesión",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [cart.items.length, router, toast])

  const handleShippingSubmit = (data) => {
    console.log("Datos de envío recibidos:", data)
    setShippingInfo(data)
    setActiveStep("payment")
  }

  const handleShippingMethodChange = (method) => {
    setShippingMethod(method)
  }

  const handlePaymentSuccess = async (paymentData) => {
    try {
      if (!user) return

      // Crear el pedido
      const orderItems = cart.items.map((item) => ({
        product_id: item.product.id,
        variant_id: item.variant?.id,
        quantity: item.quantity,
        price: item.product.price + (item.variant?.price_adjustment || 0),
        total: (item.product.price + (item.variant?.price_adjustment || 0)) * item.quantity,
      }))

      const orderData = {
        user_id: user.id,
        order_number: paymentData.external_reference || `GW-${Date.now().toString().slice(-8)}`,
        subtotal: cart.subtotal,
        discount: cart.discount,
        total: cart.total + shippingMethod.price,
        shipping_cost: shippingMethod.price,
        shipping_method: shippingMethod.name,
        payment_method: "MercadoPago",
        payment_status: "pending",
        currency: "MXN",
        status_id: "pending_payment",
        items: orderItems,
      }

      await orderService.createOrder(orderData)

      // Guardar información para la página de éxito
      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderNumber: orderData.order_number,
          date: new Date().toISOString(),
          items: cart.items,
          subtotal: cart.subtotal,
          discount: cart.discount,
          shipping: shippingMethod.price,
          total: cart.total + shippingMethod.price,
          shippingInfo,
          paymentMethod: "MercadoPago",
          currency: "MXN",
        }),
      )

      // Limpiar el carrito
      clearCart()

      toast({
        title: "¡Éxito!",
        description: "Redirigiendo a MercadoPago para completar el pago...",
      })
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al crear el pedido",
        variant: "destructive",
      })
    }
  }

  const handlePaymentError = (error) => {
    toast({
      title: "Error en el pago",
      description: "Hubo un problema al procesar el pago. Intenta de nuevo.",
      variant: "destructive",
    })
  }

  const currentStepIndex = CHECKOUT_STEPS.indexOf(activeStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === CHECKOUT_STEPS.length - 1

  const handleBack = () => {
    const prevStep = CHECKOUT_STEPS[currentStepIndex - 1]
    if (prevStep) {
      setActiveStep(prevStep)
    }
  }

  const handleNext = () => {
    const nextStep = CHECKOUT_STEPS[currentStepIndex + 1]
    if (nextStep) {
      setActiveStep(nextStep)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Cargando información de checkout...</p>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <p className="mb-6">Agrega productos a tu carrito para continuar con la compra.</p>
          <Button onClick={() => router.push("/productos")}>Ver Productos</Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Redirigirá en el useEffect
  }

  // Preparar items para MercadoPago
  const paymentItems = cart.items.map((item) => ({
    id: item.product.id,
    title: item.product.name,
    description: item.product.description || item.product.name,
    quantity: item.quantity,
    unit_price: item.product.price + (item.variant?.price_adjustment || 0),
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="shipping" disabled={activeStep !== "shipping"}>
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm mr-2">
                    1
                  </span>
                  Envío
                </div>
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={activeStep !== "payment"}>
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm mr-2">
                    2
                  </span>
                  Pago
                </div>
              </TabsTrigger>
              <TabsTrigger value="review" disabled={activeStep !== "review"}>
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm mr-2">
                    3
                  </span>
                  Revisión
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipping" className="mt-0">
              <div className="space-y-8">
                <CheckoutForm onSubmit={handleShippingSubmit} setIsValid={setIsFormValid} />

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Método de Envío</h3>
                  <ShippingMethod onChange={handleShippingMethodChange} selectedMethod={shippingMethod} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="mt-0">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Método de Pago</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">MercadoPago México</h4>
                      <p className="text-sm text-muted-foreground">
                        Paga con tarjeta de crédito, débito, OXXO, transferencia bancaria
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hasta 12 meses sin intereses con tarjetas participantes
                      </p>
                    </div>
                    <img
                      src="/placeholder.svg?height=40&width=120&text=MercadoPago"
                      alt="MercadoPago"
                      className="h-10"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Serás redirigido a MercadoPago para completar tu pago de forma segura.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="review" className="mt-0">
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Información de Envío</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p>
                        {shippingInfo.firstName} {shippingInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{shippingInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p>{shippingInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p>{shippingInfo.streetAddress}</p>
                      <p>
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}
                      </p>
                      <p>México</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Método de Envío</h3>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{shippingMethod.name}</p>
                      <p className="text-sm text-muted-foreground">{shippingMethod.estimatedDelivery}</p>
                    </div>
                    <p>${shippingMethod.price} MXN</p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Finalizar Pago</h3>
                  <MercadoPagoButton
                    items={paymentItems}
                    payer={{
                      firstName: shippingInfo.firstName,
                      lastName: shippingInfo.lastName,
                      email: shippingInfo.email,
                      phone: shippingInfo.phone,
                      streetAddress: shippingInfo.streetAddress,
                      postalCode: shippingInfo.postalCode,
                    }}
                    shippingCost={shippingMethod.price}
                    externalReference={`GW-${Date.now().toString().slice(-8)}`}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Pagar ${(cart.total + shippingMethod.price).toFixed(2)} MXN con MercadoPago
                  </MercadoPagoButton>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            {!isFirstStep ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            ) : (
              <Button variant="outline" onClick={() => router.push("/cart")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Carrito
              </Button>
            )}

            {!isLastStep && (
              <Button onClick={handleNext} disabled={!isFormValid}>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div>
          <CheckoutSummary cart={cart} shippingCost={shippingMethod.price} />
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Loader2 } from "lucide-react"
import supabase from "@/lib/supabase"

interface MercadoPagoButtonProps {
  items: Array<{
    id: string
    title: string
    description?: string
    quantity: number
    unit_price: number
  }>
  payer?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    streetAddress?: string
    postalCode?: string
  }
  shippingCost?: number
  externalReference?: string
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  className?: string
  children?: React.ReactNode
}

export function MercadoPagoButton({
  items,
  payer,
  shippingCost = 0,
  externalReference,
  onSuccess,
  onError,
  className,
  children,
}: MercadoPagoButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      console.log("=== INICIANDO PROCESO DE PAGO MÉXICO ===")

      // Obtener sesión actual de Supabase
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.log("No hay sesión activa")
        toast({
          title: "Error",
          description: "Debes iniciar sesión para realizar el pago",
          variant: "destructive",
        })
        return
      }

      console.log("Usuario autenticado:", session.user.email)

      // Preparar items para MercadoPago México
      const mpItems = items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || item.title,
        quantity: item.quantity,
        currency_id: "MXN", // México
        unit_price: item.unit_price,
      }))

      console.log("Items preparados:", mpItems)

      const requestData = {
        items: mpItems,
        payer: {
          firstName: payer?.firstName || session.user.user_metadata?.full_name?.split(" ")[0],
          lastName: payer?.lastName || session.user.user_metadata?.full_name?.split(" ").slice(1).join(" "),
          email: payer?.email || session.user.email,
          phone: payer?.phone,
          streetAddress: payer?.streetAddress,
          postalCode: payer?.postalCode,
        },
        shipping_cost: shippingCost,
        external_reference: externalReference || `order_${session.user.id}_${Date.now()}`,
      }

      console.log("Enviando datos al servidor:", requestData)

      const response = await fetch("/api/payments/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestData),
      })

      console.log("Respuesta del servidor:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error del servidor:", errorText)
        throw new Error(`Error del servidor: ${response.status}`)
      }

      const data = await response.json()
      console.log("Datos de respuesta:", data)

      if (data.success) {
        console.log("✅ Preferencia creada exitosamente:", data.preference_id)

        // Llamar onSuccess antes de redirigir
        if (onSuccess) {
          onSuccess(data)
        }

        // Redirigir a MercadoPago
        const initPoint = data.init_point
        console.log("🚀 Redirigiendo a MercadoPago México:", initPoint)
        window.location.href = initPoint
      } else {
        throw new Error(data.error || "Error al crear la preferencia de pago")
      }
    } catch (error) {
      console.error("❌ Error processing payment:", error)
      toast({
        title: "Error en el Pago",
        description: error.message || "Error al procesar el pago. Intenta de nuevo.",
        variant: "destructive",
      })

      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={isLoading} className={`w-full ${className}`} size="lg">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || "Pagar con MercadoPago"}
        </>
      )}
    </Button>
  )
}

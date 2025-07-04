"use client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutFailurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")
  const externalReference = searchParams.get("external_reference")

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
            <XCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Pago No Completado</h1>
          <p className="text-muted-foreground mt-2">
            Hubo un problema al procesar tu pago. No te preocupes, no se realizó ningún cargo.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>¿Qué pasó?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Tu pago no pudo ser procesado por una de las siguientes razones:</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Fondos insuficientes en tu cuenta</li>
              <li>Datos de la tarjeta incorrectos</li>
              <li>Límite de compra excedido</li>
              <li>Problemas temporales con el procesador de pagos</li>
              <li>Cancelaste el pago</li>
            </ul>

            {paymentId && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>ID de referencia:</strong> {paymentId}
                </p>
                {externalReference && (
                  <p className="text-sm">
                    <strong>Número de pedido:</strong> {externalReference}
                  </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/checkout">
                <RefreshCw className="mr-2 h-4 w-4" />
                Intentar de nuevo
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al carrito
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Si continúas teniendo problemas, por favor{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contáctanos
            </Link>{" "}
            y te ayudaremos a resolver el problema.
          </p>
        </div>
      </div>
    </div>
  )
}

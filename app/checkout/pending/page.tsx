"use client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutPendingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")
  const externalReference = searchParams.get("external_reference")

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
            <Clock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Pago Pendiente</h1>
          <p className="text-muted-foreground mt-2">
            Tu pago está siendo procesado. Te notificaremos cuando sea confirmado.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>¿Qué sigue?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Tu pago está pendiente de confirmación. Esto puede suceder por:</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Pago con efectivo (Rapipago, Pago Fácil, etc.)</li>
              <li>Transferencia bancaria</li>
              <li>Verificación adicional requerida por el banco</li>
              <li>Procesamiento en horario no bancario</li>
            </ul>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Próximos pasos:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Recibirás un email con las instrucciones de pago (si aplica)</li>
                <li>Te notificaremos cuando el pago sea confirmado</li>
                <li>Procesaremos tu pedido una vez confirmado el pago</li>
              </ol>
            </div>

            {paymentId && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>ID de pago:</strong> {paymentId}
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
              <Link href="/account/orders">
                Ver mis pedidos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/">Continuar comprando</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Si tienes alguna pregunta sobre tu pago, por favor{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contáctanos
            </Link>{" "}
            y te ayudaremos.
          </p>
        </div>
      </div>
    </div>
  )
}

import { type NextRequest, NextResponse } from "next/server"
import { mercadoPagoService } from "@/lib/mercadopago"
import { orderService } from "@/services/order-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Webhook received:", body)

    const result = await mercadoPagoService.processWebhook(body)

    if (result.success && result.type === "payment") {
      const payment = result.payment

      // Actualizar el estado del pedido según el estado del pago
      const externalReference = payment.external_reference
      if (externalReference) {
        let orderStatus = "pending"
        let paymentStatus = "pending"

        switch (payment.status) {
          case "approved":
            orderStatus = "confirmed"
            paymentStatus = "paid"
            break
          case "pending":
            orderStatus = "pending_payment"
            paymentStatus = "pending"
            break
          case "rejected":
          case "cancelled":
            orderStatus = "cancelled"
            paymentStatus = "failed"
            break
          default:
            orderStatus = "pending_payment"
            paymentStatus = "pending"
        }

        // Actualizar el pedido en la base de datos
        try {
          await orderService.updateOrderStatus(externalReference, {
            status_id: orderStatus,
            payment_status: paymentStatus,
            payment_id: payment.id.toString(),
            payment_method: payment.payment_method_id,
            payment_details: {
              status: payment.status,
              status_detail: payment.status_detail,
              transaction_amount: payment.transaction_amount,
              currency_id: payment.currency_id,
              date_approved: payment.date_approved,
              date_created: payment.date_created,
            },
          })

          console.log(`Order ${externalReference} updated with status: ${orderStatus}`)
        } catch (error) {
          console.error("Error updating order:", error)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
  }
}

// Permitir GET para verificación de webhook
export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint active" })
}

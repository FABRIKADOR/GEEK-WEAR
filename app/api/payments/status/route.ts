import { type NextRequest, NextResponse } from "next/server"
import { mercadoPagoService } from "@/lib/mercadopago"
import { verifyJWT } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Token de autenticación requerido" }, { status: 401 })
    }

    const decoded = await verifyJWT(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("payment_id")
    const collectionId = searchParams.get("collection_id")
    const externalReference = searchParams.get("external_reference")
    const status = searchParams.get("status")

    if (!paymentId && !collectionId) {
      return NextResponse.json({ error: "payment_id o collection_id requerido" }, { status: 400 })
    }

    const id = paymentId || collectionId
    const result = await mercadoPagoService.getPayment(id!)

    if (result.success) {
      return NextResponse.json({
        success: true,
        payment: result.payment,
        external_reference: externalReference,
        status,
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error getting payment status:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

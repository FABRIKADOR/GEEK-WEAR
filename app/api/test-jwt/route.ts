import { type NextRequest, NextResponse } from "next/server"
import { signToken, verifyToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    // Crear un token de prueba
    const testPayload = {
      userId: "test-123",
      email: "test@example.com",
      timestamp: Date.now(),
    }

    const token = await signToken(testPayload)

    // Verificar el token inmediatamente
    const verified = await verifyToken(token)

    if (verified) {
      return NextResponse.json({
        success: true,
        message: "JWT funcionando correctamente",
        tokenLength: token.length,
        payload: verified,
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Error al verificar token",
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

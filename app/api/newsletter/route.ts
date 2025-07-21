import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createWelcomeEmailTemplate } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    console.log("API Newsletter: Recibiendo petición")

    const body = await request.json()
    const { email } = body

    console.log("Email recibido:", email)

    // Validar email
    if (!email) {
      console.log("Error: Email no proporcionado")
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Error: Email inválido")
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    console.log("Procesando suscripción para:", email)

    try {
      // Crear el template del email
      const emailTemplate = createWelcomeEmailTemplate(email)

      // Enviar email de bienvenida (simulado por ahora)
      const emailResult = await sendEmail({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      })

      console.log("Email procesado exitosamente:", emailResult.messageId)

      // Información de la tienda para la respuesta
      const storeInfo = {
        storeName: "GeekWear",
        email: email,
        location: "UPQROO - Cancún, México",
        phone: "+52 (998) 351-3473",
        whatsapp: "https://wa.me/5219983513473",
        message: "¡Gracias por suscribirte a GeekWear! Tu suscripción ha sido registrada exitosamente.",
        emailSent: emailResult.provider === "simulation" ? false : true,
        messageId: emailResult.messageId,
        provider: emailResult.provider,
        note:
          emailResult.provider === "simulation"
            ? "Email simulado - Para emails reales, configura un proveedor de email como Resend"
            : undefined,
      }

      console.log("Suscripción exitosa:", storeInfo)

      return NextResponse.json({
        success: true,
        message:
          emailResult.provider === "simulation"
            ? "Suscripción registrada exitosamente (email simulado)"
            : "Suscripción exitosa y email enviado",
        data: storeInfo,
      })
    } catch (emailError) {
      console.error("Error procesando email:", emailError)

      // Aunque falle el email, consideramos la suscripción exitosa
      return NextResponse.json({
        success: true,
        message: "Suscripción registrada, pero hubo un problema con el email",
        data: {
          storeName: "GeekWear",
          email: email,
          location: "UPQROO - Cancún, México",
          phone: "+52 (998) 351-3473",
          whatsapp: "https://wa.me/5219983513473",
          message: "¡Gracias por suscribirte a GeekWear! Tu suscripción fue registrada exitosamente.",
          emailSent: false,
          error: "Error procesando email",
        },
      })
    }
  } catch (error) {
    console.error("Error en API Newsletter:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

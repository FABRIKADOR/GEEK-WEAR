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

    // Verificar que las variables de entorno estén configuradas
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Error: Variables de entorno de Gmail no configuradas")
      return NextResponse.json(
        {
          error: "Servicio de email no configurado",
        },
        { status: 500 },
      )
    }

    console.log("Procesando suscripción para:", email)

    try {
      // Crear el template del email
      const emailTemplate = createWelcomeEmailTemplate(email)

      // Enviar email de bienvenida
      const emailResult = await sendEmail({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      })

      console.log("Email enviado exitosamente:", emailResult.messageId)

      // Información de la tienda para la respuesta
      const storeInfo = {
        storeName: "GeekWear",
        email: email,
        location: "UPQROO - Cancún, México",
        phone: "+52 (998) 351-3473",
        whatsapp: "https://wa.me/5219983513473",
        message:
          "¡Gracias por suscribirte a GeekWear! Te hemos enviado un email de bienvenida con toda la información.",
        emailSent: true,
        messageId: emailResult.messageId,
      }

      console.log("Suscripción exitosa:", storeInfo)

      return NextResponse.json({
        success: true,
        message: "Suscripción exitosa y email enviado",
        data: storeInfo,
      })
    } catch (emailError) {
      console.error("Error enviando email:", emailError)

      // Aunque falle el email, consideramos la suscripción exitosa
      return NextResponse.json({
        success: true,
        message: "Suscripción exitosa, pero hubo un problema enviando el email de confirmación",
        data: {
          storeName: "GeekWear",
          email: email,
          location: "UPQROO - Cancún, México",
          phone: "+52 (998) 351-3473",
          whatsapp: "https://wa.me/5219983513473",
          message:
            "¡Gracias por suscribirte a GeekWear! Hubo un problema enviando el email, pero tu suscripción fue exitosa.",
          emailSent: false,
          error: "Error enviando email de confirmación",
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

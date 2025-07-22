import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createWelcomeEmailTemplate } from "@/lib/email-service"
import { validateEmail } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validar email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return NextResponse.json({ error: emailValidation.error || "Email inválido" }, { status: 400 })
    }

    console.log("📧 Procesando suscripción para:", email)

    // Crear template de email
    const emailTemplate = createWelcomeEmailTemplate(email)

    // Enviar email de bienvenida (simulado)
    const emailResult = await sendEmail({
      to: email,
      subject: "¡Bienvenido a GeekWear! 🎮",
      html: emailTemplate,
    })

    if (emailResult.success) {
      console.log("✅ Email enviado exitosamente:", emailResult.messageId)

      return NextResponse.json({
        success: true,
        message: "Suscripción exitosa. ¡Revisa tu email!",
        messageId: emailResult.messageId,
        type: "simulated", // Indicar que es simulado
      })
    } else {
      console.error("❌ Error enviando email:", emailResult.error)

      return NextResponse.json(
        {
          success: false,
          message: "Error al enviar email de confirmación",
          error: emailResult.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Error en API newsletter:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
        error: "Error procesando suscripción",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "API Newsletter funcionando",
    endpoints: {
      POST: "Suscribirse al newsletter",
    },
  })
}

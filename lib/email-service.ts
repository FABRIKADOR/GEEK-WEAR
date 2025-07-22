interface EmailData {
  to: string
  subject: string
  html: string
}

interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

// Simulación de envío de email para evitar errores de build
export async function sendEmail(data: EmailData): Promise<EmailResponse> {
  try {
    // Simular delay de envío
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("📧 Email simulado enviado:", {
      to: data.to,
      subject: data.subject,
      timestamp: new Date().toISOString(),
    })

    // Generar ID simulado
    const messageId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      success: true,
      messageId,
    }
  } catch (error) {
    console.error("❌ Error simulando envío de email:", error)
    return {
      success: false,
      error: "Error al simular envío de email",
    }
  }
}

// Template para email de bienvenida
export function createWelcomeEmailTemplate(email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>¡Bienvenido a GeekWear!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Bienvenido a GeekWear! 🎮</h1>
          <p>Tu tienda favorita de camisetas geek y anime</p>
        </div>
        <div class="content">
          <h2>¡Hola, futuro geek! 👋</h2>
          <p>Gracias por suscribirte a nuestro newsletter. Ahora serás el primero en conocer:</p>
          <ul>
            <li>🆕 Nuevos diseños y colecciones</li>
            <li>🔥 Ofertas exclusivas para suscriptores</li>
            <li>🎁 Descuentos especiales</li>
            <li>📦 Lanzamientos anticipados</li>
          </ul>
          <p>Como bienvenida, aquí tienes un código de descuento especial:</p>
          <div style="background: #667eea; color: white; padding: 15px; text-align: center; border-radius: 5px; font-size: 18px; font-weight: bold;">
            GEEK2024 - 15% OFF
          </div>
          <p>¡Úsalo en tu primera compra!</p>
          <a href="https://geekwear.com/productos" class="button">Ver Productos</a>
        </div>
        <div class="footer">
          <p>GeekWear - Universidad Politécnica de Quintana Roo</p>
          <p>Cancún, Quintana Roo, México</p>
          <p>¿No quieres recibir más emails? <a href="#">Desuscribirse</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

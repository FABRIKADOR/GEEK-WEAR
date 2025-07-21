// Servicio de email simplificado sin nodemailer para evitar errores de build
export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // Simulación de envío de email para evitar errores de build
    console.log("Simulando envío de email:", { to, subject })

    // En producción, aquí usarías un servicio como Resend, SendGrid, etc.
    // Por ahora simulamos el envío
    const messageId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      success: true,
      messageId,
      provider: "simulation",
    }
  } catch (error) {
    console.error("Error enviando email:", error)
    throw new Error("Error al enviar el correo electrónico")
  }
}

// Template para email de bienvenida al newsletter
export function createWelcomeEmailTemplate(email: string) {
  return {
    subject: "¡Bienvenido a la Comunidad GeekWear! 🚀",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a GeekWear</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            color: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          .logo {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #00f5ff, #ff00ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .welcome-text {
            font-size: 1.3em;
            margin-bottom: 25px;
          }
          .features {
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
            backdrop-filter: blur(10px);
          }
          .feature-item {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 15px 0;
            font-size: 1.1em;
          }
          .emoji {
            font-size: 1.5em;
            margin-right: 15px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 1.1em;
            margin: 20px 0;
            transition: transform 0.3s ease;
          }
          .contact-info {
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 20px;
            margin-top: 25px;
            backdrop-filter: blur(10px);
          }
          .contact-item {
            margin: 10px 0;
            font-size: 1em;
          }
          .footer {
            margin-top: 30px;
            font-size: 0.9em;
            opacity: 0.8;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">GeekWear</div>
          
          <div class="welcome-text">
            ¡Hola y bienvenido a la comunidad más geek de México! 🇲🇽
          </div>
          
          <p style="font-size: 1.1em; margin-bottom: 25px;">
            Gracias por suscribirte a nuestro newsletter. Ahora formas parte de una comunidad exclusiva de verdaderos geeks.
          </p>
          
          <div class="features">
            <h3 style="margin-top: 0; color: #00f5ff;">¿Qué puedes esperar?</h3>
            
            <div class="feature-item">
              <span class="emoji">🎮</span>
              <span>Ofertas exclusivas en productos gaming</span>
            </div>
            
            <div class="feature-item">
              <span class="emoji">👕</span>
              <span>Nuevos diseños de camisetas geek</span>
            </div>
            
            <div class="feature-item">
              <span class="emoji">🚀</span>
              <span>Lanzamientos de productos antes que nadie</span>
            </div>
            
            <div class="feature-item">
              <span class="emoji">💎</span>
              <span>Descuentos especiales para suscriptores</span>
            </div>
          </div>
          
          <a href="https://wa.me/5219983513473?text=Hola,%20me%20suscribí%20al%20newsletter%20y%20quiero%20conocer%20más%20productos" class="cta-button">
            💬 Chatea con nosotros en WhatsApp
          </a>
          
          <div class="contact-info">
            <h3 style="margin-top: 0; color: #feca57;">Información de Contacto</h3>
            
            <div class="contact-item">
              📍 <strong>Ubicación:</strong> UPQROO - Cancún, Quintana Roo, México
            </div>
            
            <div class="contact-item">
              📞 <strong>Teléfono:</strong> +52 (998) 351-3473
            </div>
            
            <div class="contact-item">
              📧 <strong>Email:</strong> contact@geekwear.com
            </div>
            
            <div class="contact-item">
              🕒 <strong>Horarios:</strong> Lun-Vie: 9:00 AM - 6:00 PM
            </div>
          </div>
          
          <div class="footer">
            <p>
              Este email fue enviado a: <strong>${email}</strong><br>
              Si no te suscribiste a este newsletter, puedes ignorar este mensaje.
            </p>
            
            <p style="margin-top: 20px;">
              <strong>GeekWear</strong> - La tienda más geek de México 🇲🇽<br>
              Universidad Politécnica de Quintana Roo
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
¡Bienvenido a GeekWear!

Hola y bienvenido a la comunidad más geek de México! 🇲🇽

Gracias por suscribirte a nuestro newsletter. Ahora formas parte de una comunidad exclusiva de verdaderos geeks.

¿Qué puedes esperar?
🎮 Ofertas exclusivas en productos gaming
👕 Nuevos diseños de camisetas geek  
🚀 Lanzamientos de productos antes que nadie
💎 Descuentos especiales para suscriptores

Información de Contacto:
📍 Ubicación: UPQROO - Cancún, Quintana Roo, México
📞 Teléfono: +52 (998) 351-3473
📧 Email: contact@geekwear.com
🕒 Horarios: Lun-Vie: 9:00 AM - 6:00 PM

WhatsApp: https://wa.me/5219983513473

Este email fue enviado a: ${email}
Si no te suscribiste a este newsletter, puedes ignorar este mensaje.

GeekWear - La tienda más geek de México 🇲🇽
Universidad Politécnica de Quintana Roo
    `,
  }
}

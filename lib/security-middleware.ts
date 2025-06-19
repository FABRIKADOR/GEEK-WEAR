import type { NextRequest } from "next/server"
import { rateLimit } from "./rate-limit"
import { verifyJWT } from "./jwt"

export interface SecurityOptions {
  requireAuth?: boolean
  requireAdmin?: boolean
  rateLimit?: {
    requests: number
    window: number // en segundos
  }
  allowedMethods?: string[]
}

export class SecurityMiddleware {
  static async validate(
    request: NextRequest,
    options: SecurityOptions = {},
  ): Promise<{ success: boolean; error?: string; user?: any }> {
    // Verificar método HTTP permitido
    if (options.allowedMethods && !options.allowedMethods.includes(request.method)) {
      return { success: false, error: "Método no permitido" }
    }

    // Rate limiting
    if (options.rateLimit) {
      const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"
      const isAllowed = await rateLimit(clientIP, options.rateLimit.requests, options.rateLimit.window)

      if (!isAllowed) {
        return { success: false, error: "Demasiadas solicitudes. Intenta más tarde." }
      }
    }

    // Verificar autenticación si es requerida
    if (options.requireAuth) {
      const authHeader = request.headers.get("authorization")

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { success: false, error: "Token de autorización requerido" }
      }

      const token = authHeader.substring(7)

      try {
        const payload = await verifyJWT(token)

        // Verificar si requiere permisos de admin
        if (options.requireAdmin && !payload.isAdmin) {
          return { success: false, error: "Permisos de administrador requeridos" }
        }

        return { success: true, user: payload }
      } catch (error) {
        return { success: false, error: "Token inválido o expirado" }
      }
    }

    return { success: true }
  }

  static async logSecurityEvent(event: string, details: any, request: NextRequest) {
    const logData = {
      event,
      details,
      ip: request.ip || request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
    }

    // Aquí podrías enviar a un servicio de logging como Supabase
    console.log("Security Event:", logData)

    // Opcional: guardar en base de datos
    // await supabase.from('security_logs').insert(logData)
  }
}

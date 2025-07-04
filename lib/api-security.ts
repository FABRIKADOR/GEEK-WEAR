import type { NextRequest } from "next/server"
import { verifyToken } from "./jwt"
import { rateLimit } from "./rate-limit"

export async function validateApiRequest(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await rateLimit(request)
  if (!rateLimitResult.success) {
    return { error: "Demasiadas solicitudes", status: 429 }
  }

  // Verificar token JWT si es necesario
  const authHeader = request.headers.get("authorization")
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "")
    const payload = await verifyToken(token)
    if (!payload) {
      return { error: "Token inválido", status: 401 }
    }
    return { user: payload, success: true }
  }

  return { success: true }
}

export function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .trim()
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }

  if (typeof input === "object" && input !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }

  return input
}

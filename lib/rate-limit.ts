import type { NextRequest } from "next/server"

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// Almacén en memoria para rate limiting (en producción usar Redis)
const requests = new Map<string, { count: number; resetTime: number }>()

export async function rateLimit(
  request: NextRequest,
  limit = 100,
  windowMs: number = 15 * 60 * 1000, // 15 minutos
): Promise<RateLimitResult> {
  try {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const now = Date.now()
    const windowStart = now - windowMs

    // Limpiar entradas expiradas
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < now) {
        requests.delete(key)
      }
    }

    const current = requests.get(ip)

    if (!current || current.resetTime < now) {
      // Primera request o ventana expirada
      requests.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      })

      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: now + windowMs,
      }
    }

    if (current.count >= limit) {
      // Límite excedido
      return {
        success: false,
        limit,
        remaining: 0,
        reset: current.resetTime,
      }
    }

    // Incrementar contador
    current.count++
    requests.set(ip, current)

    return {
      success: true,
      limit,
      remaining: limit - current.count,
      reset: current.resetTime,
    }
  } catch (error) {
    console.error("Error en rate limiting:", error)
    // En caso de error, permitir la request
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Date.now() + windowMs,
    }
  }
}

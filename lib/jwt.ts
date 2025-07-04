import { SignJWT, jwtVerify } from "jose"

// Asegurarse de que siempre haya un secreto, incluso en desarrollo
const JWT_SECRET = process.env.JWT_SECRET || "clave-secreta-temporal-para-desarrollo-local"
const secret = new TextEncoder().encode(JWT_SECRET)

export async function signToken(payload: any) {
  try {
    // Asegurarse de que el payload no tenga propiedades undefined
    const cleanPayload = JSON.parse(JSON.stringify(payload))

    console.log("Creando token para:", cleanPayload.email)

    return await new SignJWT(cleanPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret)
  } catch (error) {
    console.error("Error creando token:", error)
    throw error
  }
}

export async function verifyToken(token: string) {
  try {
    if (!token || token === "undefined" || token === "null") {
      console.log("Token vacío o inválido")
      return null
    }

    const { payload } = await jwtVerify(token, secret, {
      maxTokenAge: "24h", // Verificar que el token no sea más antiguo que 24 horas
    })

    console.log("Token verificado exitosamente para:", payload.email)
    return payload
  } catch (error) {
    console.log("Error verificando token:", error.message)
    return null
  }
}

export async function refreshToken(token: string) {
  const payload = await verifyToken(token)
  if (!payload) return null

  // Crear nuevo token con la misma información pero nueva expiración
  return await signToken(payload)
}

// Alias para compatibilidad
export const verifyJWT = verifyToken
export const signJWT = signToken

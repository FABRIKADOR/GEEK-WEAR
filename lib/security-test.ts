import { signToken, verifyToken } from "./jwt"
import { encrypt, decrypt } from "./encryption"

export async function testSecurity() {
  console.log("🔐 Probando sistema de seguridad...")

  // Test JWT
  try {
    const testPayload = { userId: "123", email: "test@example.com" }
    const token = await signToken(testPayload)
    const verified = await verifyToken(token)

    console.log("✅ JWT funcionando correctamente")
    console.log("Token generado:", token.substring(0, 50) + "...")
    console.log("Payload verificado:", verified)
  } catch (error) {
    console.error("❌ Error en JWT:", error)
  }

  // Test Cifrado
  try {
    const testData = "Datos sensibles del usuario"
    const encrypted = encrypt(testData)
    const decrypted = decrypt(encrypted)

    console.log("✅ Cifrado funcionando correctamente")
    console.log("Datos originales:", testData)
    console.log("Datos cifrados:", encrypted)
    console.log("Datos descifrados:", decrypted)
  } catch (error) {
    console.error("❌ Error en cifrado:", error)
  }
}

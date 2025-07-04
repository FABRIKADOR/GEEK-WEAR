import CryptoJS from "crypto-js"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "clave-de-cifrado-muy-segura"

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
}

export function decrypt(ciphertext: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error("Error al descifrar:", error)
    return ""
  }
}

export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password + ENCRYPTION_KEY).toString()
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

// Cifrar datos sensibles para localStorage
export function encryptLocalStorage(key: string, data: any): void {
  const encrypted = encrypt(JSON.stringify(data))
  localStorage.setItem(key, encrypted)
}

export function decryptLocalStorage(key: string): any {
  try {
    const encrypted = localStorage.getItem(key)
    if (!encrypted) return null

    const decrypted = decrypt(encrypted)
    return JSON.parse(decrypted)
  } catch (error) {
    console.error("Error al descifrar localStorage:", error)
    return null
  }
}

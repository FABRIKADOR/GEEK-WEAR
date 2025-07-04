import { encryptLocalStorage, decryptLocalStorage } from "./encryption"

class SecureStorage {
  // Almacenamiento seguro para el carrito
  setCart(cart: any) {
    encryptLocalStorage("secure_cart", cart)
  }

  getCart() {
    return decryptLocalStorage("secure_cart")
  }

  // Almacenamiento seguro para preferencias del usuario
  setUserPreferences(preferences: any) {
    encryptLocalStorage("user_prefs", preferences)
  }

  getUserPreferences() {
    return decryptLocalStorage("user_prefs")
  }

  // Almacenamiento seguro para datos temporales
  setTempData(key: string, data: any, expirationMinutes = 30) {
    const expiration = Date.now() + expirationMinutes * 60 * 1000
    const dataWithExpiration = { data, expiration }
    encryptLocalStorage(`temp_${key}`, dataWithExpiration)
  }

  getTempData(key: string) {
    const stored = decryptLocalStorage(`temp_${key}`)
    if (!stored) return null

    if (Date.now() > stored.expiration) {
      localStorage.removeItem(`temp_${key}`)
      return null
    }

    return stored.data
  }

  // Limpiar todos los datos seguros
  clearSecureData() {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith("secure_") || key.startsWith("temp_")) {
        localStorage.removeItem(key)
      }
    })
  }
}

export const secureStorage = new SecureStorage()

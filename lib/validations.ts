// Expresiones regulares para validación
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
export const PHONE_REGEX = /^(\+52\s?)?(\d{2}\s?\d{4}\s?\d{4}|\d{10})$/
export const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/

// Funciones de validación
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

export function validatePassword(password: string): boolean {
  return PASSWORD_REGEX.test(password)
}

export function validatePhone(phone: string): boolean {
  return PHONE_REGEX.test(phone)
}

export function validateName(name: string): boolean {
  return NAME_REGEX.test(name)
}

// Función para verificar fortaleza de contraseña
export function getPasswordStrength(password: string) {
  return {
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[@$!%*?&]/.test(password),
    hasLength: password.length >= 8,
  }
}

// Mensajes de error
export const VALIDATION_MESSAGES = {
  email: "Por favor ingresa un email válido",
  password:
    "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos (@$!%*?&)",
  phone: "Formato válido: +52 55 1234 5678 o 5512345678",
  name: "El nombre debe tener entre 2-50 caracteres y solo contener letras y espacios",
}

import { z } from "zod"

// Esquemas de validación con Zod
const emailSchema = z.string().email("Email inválido")
const passwordSchema = z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
const phoneSchema = z.string().regex(/^[+]?[1-9][\d]{0,15}$/, "Número de teléfono inválido")
const nameSchema = z
  .string()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(50, "El nombre no puede tener más de 50 caracteres")

// Funciones de validación
export const validateEmail = (email: string) => {
  try {
    emailSchema.parse(email)
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message }
    }
    return { isValid: false, error: "Error de validación" }
  }
}

export const validatePassword = (password: string) => {
  try {
    passwordSchema.parse(password)
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message }
    }
    return { isValid: false, error: "Error de validación" }
  }
}

export const validatePhone = (phone: string) => {
  try {
    phoneSchema.parse(phone)
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message }
    }
    return { isValid: false, error: "Error de validación" }
  }
}

export const validateName = (name: string) => {
  try {
    nameSchema.parse(name)
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message }
    }
    return { isValid: false, error: "Error de validación" }
  }
}

// Validación de formulario completo
export const validateUserForm = (data: {
  email: string
  password: string
  name: string
  phone?: string
}) => {
  const errors: Record<string, string> = {}

  const emailResult = validateEmail(data.email)
  if (!emailResult.isValid) {
    errors.email = emailResult.error || "Email inválido"
  }

  const passwordResult = validatePassword(data.password)
  if (!passwordResult.isValid) {
    errors.password = passwordResult.error || "Contraseña inválida"
  }

  const nameResult = validateName(data.name)
  if (!nameResult.isValid) {
    errors.name = nameResult.error || "Nombre inválido"
  }

  if (data.phone) {
    const phoneResult = validatePhone(data.phone)
    if (!phoneResult.isValid) {
      errors.phone = phoneResult.error || "Teléfono inválido"
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

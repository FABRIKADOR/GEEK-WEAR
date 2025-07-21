import { z } from "zod"

// Esquemas de validación con Zod
const emailSchema = z.string().email("Email inválido")
const passwordSchema = z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Número de teléfono inválido")
const nameSchema = z
  .string()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(50, "El nombre no puede tener más de 50 caracteres")

// Funciones de validación
export function validateEmail(email: string): { isValid: boolean; error?: string } {
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

export function validatePassword(password: string): { isValid: boolean; error?: string } {
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

export function validatePhone(phone: string): { isValid: boolean; error?: string } {
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

export function validateName(name: string): { isValid: boolean; error?: string } {
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

// Esquemas adicionales para formularios
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: nameSchema,
    lastName: nameSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema.optional(),
  email: emailSchema,
})

export const addressSchema = z.object({
  street: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
  state: z.string().min(2, "El estado debe tener al menos 2 caracteres"),
  zipCode: z.string().min(5, "El código postal debe tener al menos 5 caracteres"),
  country: z.string().min(2, "El país debe tener al menos 2 caracteres"),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type AddressFormData = z.infer<typeof addressSchema>

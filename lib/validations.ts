import { z } from "zod"

// Expresiones regulares para validación
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
export const PHONE_REGEX = /^(\+52|52)?[\s-]?(\d{2})[\s-]?(\d{4})[\s-]?(\d{4})$/
export const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Esquemas de validación con Zod
export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(
    PASSWORD_REGEX,
    "La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial",
  )

export const emailSchema = z
  .string()
  .email("Formato de email inválido")
  .regex(EMAIL_REGEX, "Email debe tener un formato válido")

export const phoneSchema = z.string().regex(PHONE_REGEX, "Formato de teléfono inválido (ej: +52 55 1234 5678)")

export const nameSchema = z
  .string()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(50, "El nombre no puede exceder 50 caracteres")
  .regex(NAME_REGEX, "El nombre solo puede contener letras y espacios")

export const userRegistrationSchema = z
  .object({
    fullName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    phone: phoneSchema.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "La contraseña es requerida"),
})

// Validación para exportación
export const exportSchema = z.object({
  type: z.enum(["products", "orders", "users", "categories", "franchises"]),
  filters: z
    .object({
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
      category: z.string().optional(),
      franchise: z.string().optional(),
      status: z.string().optional(),
    })
    .optional(),
  format: z.enum(["xlsx", "csv"]).default("xlsx"),
})

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { GoogleLoginButton } from "@/components/google-login-button"
import { useAuth } from "@/contexts/auth-context"
import { validateEmail, validatePassword, validatePhone, validateName, getPasswordStrength } from "@/lib/validations"

interface PasswordStrength {
  hasLower: boolean
  hasUpper: boolean
  hasNumber: boolean
  hasSpecial: boolean
  hasLength: boolean
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
    hasLength: false,
  })

  const router = useRouter()
  const { toast } = useToast()
  const { signUp } = useAuth()

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors }

    switch (field) {
      case "fullName":
        if (!validateName(value)) {
          newErrors.fullName = "El nombre debe tener entre 2-50 caracteres y solo contener letras y espacios"
        } else {
          delete newErrors.fullName
        }
        break
      case "email":
        if (!validateEmail(value)) {
          newErrors.email = "Por favor ingresa un email válido"
        } else {
          delete newErrors.email
        }
        break
      case "phone":
        if (value && !validatePhone(value)) {
          newErrors.phone = "Formato: +52 55 1234 5678"
        } else {
          delete newErrors.phone
        }
        break
      case "password":
        if (!validatePassword(value)) {
          newErrors.password = "La contraseña no cumple con los requisitos"
        } else {
          delete newErrors.password
        }
        // Actualizar indicadores de fortaleza
        setPasswordStrength(getPasswordStrength(value))
        break
      case "confirmPassword":
        if (value !== formData.password) {
          newErrors.confirmPassword = "Las contraseñas no coinciden"
        } else {
          delete newErrors.confirmPassword
        }
        break
    }

    setErrors(newErrors)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar todos los campos
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field as keyof typeof formData])
    })

    // Verificar si hay errores
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      })
      return
    }

    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.fullName)

      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada. Revisa tu email para confirmar tu cuenta.",
      })

      router.push("/auth/login")
    } catch (error: any) {
      console.error("Error en registro:", error)
      toast({
        title: "Error al registrarse",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStrengthColor = (isValid: boolean) => {
    return isValid ? "text-green-600" : "text-gray-400"
  }

  const allRequirementsMet = Object.values(passwordStrength).every(Boolean)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear una Cuenta</CardTitle>
          <CardDescription className="text-center">
            Regístrate para comenzar a comprar y rastrear tus pedidos
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Botón de Google */}
            <GoogleLoginButton />

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O CONTINÚA CON</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono (Opcional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+52 55 1234 5678"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className={errors.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Indicadores de fortaleza de contraseña */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-gray-700">Requisitos de contraseña:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center gap-1 ${getStrengthColor(passwordStrength.hasLength)}`}>
                      {passwordStrength.hasLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      8+ caracteres
                    </div>
                    <div className={`flex items-center gap-1 ${getStrengthColor(passwordStrength.hasUpper)}`}>
                      {passwordStrength.hasUpper ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Mayúscula
                    </div>
                    <div className={`flex items-center gap-1 ${getStrengthColor(passwordStrength.hasLower)}`}>
                      {passwordStrength.hasLower ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Minúscula
                    </div>
                    <div className={`flex items-center gap-1 ${getStrengthColor(passwordStrength.hasNumber)}`}>
                      {passwordStrength.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Número
                    </div>
                    <div className={`flex items-center gap-1 ${getStrengthColor(passwordStrength.hasSpecial)}`}>
                      {passwordStrength.hasSpecial ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Especial (@$!%*?&)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading || !allRequirementsMet || Object.keys(errors).length > 0}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login" className="font-medium text-purple-600 hover:text-purple-500">
                Iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

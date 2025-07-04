"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Check, X, Loader2, User, Mail, Phone, Shield, Sparkles, Zap, Star } from "lucide-react"
import { GoogleLoginButton } from "@/components/google-login-button"
import { useAuth } from "@/contexts/auth-context"
import { PASSWORD_REGEX, PHONE_REGEX, NAME_REGEX, EMAIL_REGEX } from "@/lib/validations"

interface PasswordStrength {
  hasLength: boolean
  hasLower: boolean
  hasUpper: boolean
  hasNumber: boolean
  hasSpecial: boolean
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
    hasLength: false,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
  })

  const router = useRouter()
  const { toast } = useToast()
  const { signUp } = useAuth()

  // Validación en tiempo real
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors }

    switch (field) {
      case "fullName":
        if (value && !NAME_REGEX.test(value)) {
          newErrors.fullName = "Solo letras y espacios, 2-50 caracteres"
        } else if (value.length < 2) {
          newErrors.fullName = "Mínimo 2 caracteres"
        } else {
          delete newErrors.fullName
        }
        break

      case "email":
        if (value && !EMAIL_REGEX.test(value)) {
          newErrors.email = "Formato de email inválido"
        } else {
          delete newErrors.email
        }
        break

      case "phone":
        if (value && !PHONE_REGEX.test(value)) {
          newErrors.phone = "Formato: +52 55 1234 5678"
        } else {
          delete newErrors.phone
        }
        break

      case "password":
        const strength = {
          hasLength: value.length >= 8,
          hasLower: /[a-z]/.test(value),
          hasUpper: /[A-Z]/.test(value),
          hasNumber: /\d/.test(value),
          hasSpecial: /[@$!%*?&]/.test(value),
        }
        setPasswordStrength(strength)

        if (value && !PASSWORD_REGEX.test(value)) {
          newErrors.password = "La contraseña no cumple con los requisitos"
        } else {
          delete newErrors.password
        }
        break

      case "confirmPassword":
        if (value && value !== formData.password) {
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

    const requiredFields = ["fullName", "email", "password", "confirmPassword"]
    let hasErrors = false

    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData]
      if (!value) {
        setErrors((prev) => ({ ...prev, [field]: "Este campo es requerido" }))
        hasErrors = true
      } else {
        validateField(field, value)
      }
    })

    if (formData.phone) {
      validateField("phone", formData.phone)
    }

    if (hasErrors || Object.keys(errors).length > 0) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      })
      return
    }

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
        title: "¡Bienvenido al GameVault!",
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

  const getRequirementColor = (isValid: boolean) => {
    return isValid ? "text-neon-green" : "text-gray-500"
  }

  const allRequirementsMet = Object.values(passwordStrength).every(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space via-dark-slate to-midnight-blue text-white overflow-hidden relative">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(138,43,226,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(138,43,226,0.03)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>

      {/* Floating Gaming Elements */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${
              i % 4 === 0
                ? "bg-cyber-blue"
                : i % 4 === 1
                  ? "bg-neon-green"
                  : i % 4 === 2
                    ? "bg-electric-purple"
                    : "bg-plasma-pink"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-lg w-full"
          initial={{ opacity: 0, y: 50, rotateY: 15 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
        >
          {/* Epic Gaming Card */}
          <div className="bg-gradient-to-br from-midnight-blue/95 to-dark-slate/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-electric-purple/40 p-8 relative overflow-hidden">
            {/* Epic Glow Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 via-electric-purple/10 to-neon-green/5 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-blue via-neon-green via-electric-purple to-plasma-pink"></div>

            {/* Header */}
            <motion.div
              className="text-center mb-8 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-electric-purple via-plasma-pink to-cyber-blue flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Star className="w-10 h-10 text-white" />
                </motion.div>
              </div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyber-blue via-electric-purple via-neon-green to-plasma-pink bg-clip-text text-transparent animate-pulse">
                Crear Cuenta
              </h1>
              <p className="text-gray-300">
                Únete a la comunidad gamer más{" "}
                <span className="text-transparent bg-gradient-to-r from-neon-green to-cyber-blue bg-clip-text font-bold">
                  épica
                </span>{" "}
                del universo
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {/* Full Name */}
              <div className="group">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyber-blue" />
                    Nombre Gamer <span className="text-neon-green">*</span>
                  </span>
                </label>
                <div className="relative">
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Tu nombre épico"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-dark-slate/60 border-2 ${
                      errors.fullName
                        ? "border-red-500"
                        : "border-cyber-blue/40 focus:border-cyber-blue group-hover:border-neon-green/60"
                    } text-white placeholder-gray-400 focus:ring-2 focus:ring-cyber-blue/50 transition-all duration-300`}
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyber-blue/5 to-neon-green/5 pointer-events-none group-hover:from-cyber-blue/10 group-hover:to-neon-green/10 transition-all duration-300"></div>
                </div>
                {errors.fullName && (
                  <motion.p
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <X className="w-3 h-3" />
                    {errors.fullName}
                  </motion.p>
                )}
              </div>

              {/* Email */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-electric-purple" />
                    Email <span className="text-neon-green">*</span>
                  </span>
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="gamer@gamevault.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-dark-slate/60 border-2 ${
                      errors.email
                        ? "border-red-500"
                        : "border-electric-purple/40 focus:border-electric-purple group-hover:border-plasma-pink/60"
                    } text-white placeholder-gray-400 focus:ring-2 focus:ring-electric-purple/50 transition-all duration-300`}
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-electric-purple/5 to-plasma-pink/5 pointer-events-none group-hover:from-electric-purple/10 group-hover:to-plasma-pink/10 transition-all duration-300"></div>
                </div>
                {errors.email && (
                  <motion.p
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <X className="w-3 h-3" />
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Phone */}
              <div className="group">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neon-green" />
                    Teléfono <span className="text-gray-500">(opcional)</span>
                  </span>
                </label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-dark-slate/60 border-2 ${
                      errors.phone
                        ? "border-red-500"
                        : "border-neon-green/40 focus:border-neon-green group-hover:border-gaming-orange/60"
                    } text-white placeholder-gray-400 focus:ring-2 focus:ring-neon-green/50 transition-all duration-300`}
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-green/5 to-gaming-orange/5 pointer-events-none group-hover:from-neon-green/10 group-hover:to-gaming-orange/10 transition-all duration-300"></div>
                </div>
                {errors.phone && (
                  <motion.p
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <X className="w-3 h-3" />
                    {errors.phone}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gaming-orange" />
                    Contraseña <span className="text-neon-green">*</span>
                  </span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-dark-slate/60 border-2 ${
                      errors.password
                        ? "border-red-500"
                        : "border-gaming-orange/40 focus:border-gaming-orange group-hover:border-cyber-blue/60"
                    } text-white placeholder-gray-400 focus:ring-2 focus:ring-gaming-orange/50 transition-all duration-300`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gaming-orange transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gaming-orange/5 to-cyber-blue/5 pointer-events-none group-hover:from-gaming-orange/10 group-hover:to-cyber-blue/10 transition-all duration-300"></div>
                </div>

                {/* Epic Password Requirements */}
                {formData.password && (
                  <motion.div
                    className="mt-4 p-4 bg-gradient-to-r from-dark-slate/80 to-midnight-blue/80 rounded-xl border border-electric-purple/30 backdrop-blur-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-electric-purple" />
                      Requisitos de Contraseña:
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <motion.div
                        className={`flex items-center gap-2 ${getRequirementColor(passwordStrength.hasLength)}`}
                        animate={{ scale: passwordStrength.hasLength ? 1.05 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {passwordStrength.hasLength ? (
                          <Check className="h-3 w-3 text-neon-green" />
                        ) : (
                          <X className="h-3 w-3 text-gray-500" />
                        )}
                        8+ caracteres
                      </motion.div>
                      <motion.div
                        className={`flex items-center gap-2 ${getRequirementColor(passwordStrength.hasUpper)}`}
                        animate={{ scale: passwordStrength.hasUpper ? 1.05 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {passwordStrength.hasUpper ? (
                          <Check className="h-3 w-3 text-neon-green" />
                        ) : (
                          <X className="h-3 w-3 text-gray-500" />
                        )}
                        Mayúscula
                      </motion.div>
                      <motion.div
                        className={`flex items-center gap-2 ${getRequirementColor(passwordStrength.hasLower)}`}
                        animate={{ scale: passwordStrength.hasLower ? 1.05 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {passwordStrength.hasLower ? (
                          <Check className="h-3 w-3 text-neon-green" />
                        ) : (
                          <X className="h-3 w-3 text-gray-500" />
                        )}
                        Minúscula
                      </motion.div>
                      <motion.div
                        className={`flex items-center gap-2 ${getRequirementColor(passwordStrength.hasNumber)}`}
                        animate={{ scale: passwordStrength.hasNumber ? 1.05 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {passwordStrength.hasNumber ? (
                          <Check className="h-3 w-3 text-neon-green" />
                        ) : (
                          <X className="h-3 w-3 text-gray-500" />
                        )}
                        Número
                      </motion.div>
                      <motion.div
                        className={`flex items-center gap-2 ${getRequirementColor(passwordStrength.hasSpecial)} col-span-2`}
                        animate={{ scale: passwordStrength.hasSpecial ? 1.05 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {passwordStrength.hasSpecial ? (
                          <Check className="h-3 w-3 text-neon-green" />
                        ) : (
                          <X className="h-3 w-3 text-gray-500" />
                        )}
                        Especial (@$!%*?&)
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-plasma-pink" />
                    Confirmar Contraseña <span className="text-neon-green">*</span>
                  </span>
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-dark-slate/60 border-2 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-plasma-pink/40 focus:border-plasma-pink group-hover:border-electric-purple/60"
                    } text-white placeholder-gray-400 focus:ring-2 focus:ring-plasma-pink/50 transition-all duration-300`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-plasma-pink transition-colors duration-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-plasma-pink/5 to-electric-purple/5 pointer-events-none group-hover:from-plasma-pink/10 group-hover:to-electric-purple/10 transition-all duration-300"></div>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <X className="w-3 h-3" />
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>

              {/* Epic Submit Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading || !allRequirementsMet || Object.keys(errors).length > 0}
                  className="w-full bg-gradient-to-r from-cyber-blue via-electric-purple via-neon-green to-plasma-pink hover:from-neon-green hover:via-plasma-pink hover:to-cyber-blue text-dark-slate font-bold py-4 px-6 rounded-xl transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:shadow-2xl hover:shadow-electric-purple/30 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creando cuenta épica...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Registrarse
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </motion.form>

            {/* Divider */}
            <motion.div
              className="relative my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-cyber-blue via-electric-purple to-neon-green opacity-30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-r from-midnight-blue to-dark-slate text-gray-400 uppercase tracking-wider font-semibold">
                  O CONTINÚA CON
                </span>
              </div>
            </motion.div>

            {/* Google Button */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              <GoogleLoginButton />
            </motion.div>

            {/* Footer */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
            >
              <p className="text-gray-400">
                ¿Ya eres parte del GameVault?{" "}
                <Link
                  href="/auth/login"
                  className="text-transparent bg-gradient-to-r from-cyber-blue to-neon-green bg-clip-text hover:from-neon-green hover:to-electric-purple font-semibold transition-all duration-300"
                >
                  Iniciar Sesión
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

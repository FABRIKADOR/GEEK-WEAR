"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Loader2, Zap, Shield, Gamepad2, Sparkles } from "lucide-react"
import { GoogleLoginButton } from "@/components/google-login-button"
import { validateEmail } from "@/lib/validations"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  // Verificar si ya hay una sesión activa
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        const redirect = localStorage.getItem("redirectAfterLogin") || "/"
        localStorage.removeItem("redirectAfterLogin")
        router.push(redirect)
      }
    }
    checkSession()
  }, [router])

  // Validar email en tiempo real
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    if (value && !validateEmail(value).isValid) {
      setEmailError("Formato de email inválido")
    } else {
      setEmailError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email).isValid) {
      setEmailError("Formato de email inválido")
      return
    }

    if (!password) {
      toast({
        title: "Error",
        description: "La contraseña es requerida",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "¡Bienvenido Gamer!",
        description: "Has iniciado sesión correctamente. ¡Que comience la aventura!",
      })

      const redirect = localStorage.getItem("redirectAfterLogin") || "/"
      localStorage.removeItem("redirectAfterLogin")
      router.push(redirect)
    } catch (error: any) {
      console.error("Error de inicio de sesión:", error)
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales inválidas. Verifica tu email y contraseña.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space via-dark-slate to-midnight-blue text-white overflow-hidden relative">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyber-blue to-neon-green rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 50, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
        >
          {/* Gaming Card */}
          <div className="bg-gradient-to-br from-midnight-blue/90 to-dark-slate/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyber-blue/30 p-8 relative overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/10 via-neon-green/10 to-electric-purple/10 rounded-3xl blur-xl"></div>

            {/* Header */}
            <motion.div
              className="text-center mb-8 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyber-blue to-neon-green flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyber-blue via-neon-green to-electric-purple bg-clip-text text-transparent">
                Iniciar Sesión
              </h1>
              <p className="text-gray-300">
                Ingresa tus credenciales para acceder al{" "}
                <span className="text-neon-green font-semibold">GameVault</span>
              </p>
            </motion.div>

            {/* Google Button */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <GoogleLoginButton />
            </motion.div>

            {/* Divider */}
            <motion.div
              className="relative mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-cyber-blue via-neon-green to-electric-purple opacity-30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-r from-midnight-blue to-dark-slate text-gray-400 uppercase tracking-wider font-semibold">
                  O CONTINÚA CON
                </span>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyber-blue" />
                    Correo Electrónico
                  </span>
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="gamer@gamevault.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full px-4 py-3 rounded-xl bg-dark-slate/50 border-2 ${
                      emailError
                        ? "border-red-500"
                        : "border-cyber-blue/30 focus:border-cyber-blue group-hover:border-neon-green/50"
                    } text-white placeholder-gray-400 focus:ring-2 focus:ring-cyber-blue/50 transition-all duration-300`}
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyber-blue/5 to-neon-green/5 pointer-events-none group-hover:from-cyber-blue/10 group-hover:to-neon-green/10 transition-all duration-300"></div>
                </div>
                {emailError && (
                  <motion.p
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Sparkles className="w-3 h-3" />
                    {emailError}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-electric-purple" />
                      Contraseña
                    </span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-cyber-blue hover:text-neon-green transition-colors duration-300"
                  >
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-dark-slate/50 border-2 border-electric-purple/30 focus:border-electric-purple group-hover:border-plasma-pink/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-electric-purple/50 transition-all duration-300"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-electric-purple transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-electric-purple/5 to-plasma-pink/5 pointer-events-none group-hover:from-electric-purple/10 group-hover:to-plasma-pink/10 transition-all duration-300"></div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading || !!emailError}
                  className="w-full bg-gradient-to-r from-cyber-blue via-neon-green to-electric-purple hover:from-neon-green hover:via-electric-purple hover:to-cyber-blue text-dark-slate font-bold py-4 px-6 rounded-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:shadow-2xl hover:shadow-cyber-blue/25 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <Gamepad2 className="h-5 w-5" />
                        Iniciar Sesión
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </motion.form>

            {/* Footer */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <p className="text-gray-400">
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/auth/register"
                  className="text-transparent bg-gradient-to-r from-cyber-blue to-neon-green bg-clip-text hover:from-neon-green hover:to-electric-purple font-semibold transition-all duration-300"
                >
                  Únete al GameVault
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

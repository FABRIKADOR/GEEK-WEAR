"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import supabase from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface GoogleLoginButtonProps {
  text?: string
}

export function GoogleLoginButton({ text = "Continuar con Google" }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)

      // Guardar la página actual para redirección después del login
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectAfterLogin", window.location.pathname)
      }

      // Usar la URL de callback de Supabase directamente
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      // La redirección a Google ocurrirá automáticamente
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error)
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "No se pudo iniciar sesión con Google. Intenta de nuevo.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-gradient-to-r from-white/95 to-gray-100/95 hover:from-white hover:to-gray-50 border-2 border-gray-300/50 hover:border-cyber-blue/50 text-gray-800 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyber-blue/20 relative overflow-hidden group"
        onClick={handleGoogleLogin}
      >
        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 to-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" className="flex-shrink-0">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span className="text-gray-800 font-medium">{isLoading ? "Conectando..." : text}</span>
        </div>
      </Button>
    </motion.div>
  )
}

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AdminCheckSimpleProps {
  children: React.ReactNode
}

export function AdminCheckSimple({ children }: AdminCheckSimpleProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAccess = () => {
      console.log("🔍 AdminCheckSimple - Estado:", { user: user?.email, loading })

      if (loading) {
        console.log("⏳ Esperando autenticación...")
        return
      }

      if (!user) {
        console.log("❌ No hay usuario, redirigiendo a login")
        router.push("/auth/login")
        return
      }

      // Lista simple de emails de administradores
      const adminEmails = [
        "admin@example.com",
        "202200420@upcarco.edu.mx", // Añade tu email aquí
        "test@example.com",
      ]

      if (adminEmails.includes(user.email)) {
        console.log("✅ Usuario es administrador:", user.email)
        setIsChecking(false)
      } else {
        console.log("❌ Usuario no es administrador:", user.email)
        router.push("/")
      }
    }

    // Pequeño delay para evitar flickering
    const timer = setTimeout(checkAccess, 100)
    return () => clearTimeout(timer)
  }, [user, loading, router])

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

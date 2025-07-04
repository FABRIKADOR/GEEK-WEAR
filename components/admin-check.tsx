"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AdminCheckProps {
  children: React.ReactNode
}

export function AdminCheck({ children }: AdminCheckProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const checkAccess = () => {
      console.log("🔍 AdminCheck - Verificando acceso:", {
        user: user?.email,
        loading,
        timestamp: new Date().toISOString(),
      })

      // Si aún está cargando la autenticación, esperar
      if (loading) {
        console.log("⏳ Esperando autenticación...")
        return
      }

      // Si no hay usuario, redirigir a login
      if (!user) {
        console.log("❌ No hay usuario autenticado, redirigiendo...")
        router.push("/auth/login")
        return
      }

      // Lista de emails de administradores - ACTUALIZADA
      const adminEmails = [
        "admin@example.com",
        "202200420@upcarco.edu.mx",
        "test@example.com",
        "admin@geekwear.com",
        "hola@mail.com", // ✅ Agregado tu email
        "artinaguilar5555@outlook.com", // ✅ Por si usas este también
      ]

      // Verificar si es administrador
      const isAdmin = adminEmails.includes(user.email || "")

      if (isAdmin) {
        console.log("✅ Usuario es administrador:", user.email)
        setHasAccess(true)
        setIsChecking(false)
      } else {
        console.log("❌ Usuario no es administrador:", user.email)
        console.log("📋 Emails de admin permitidos:", adminEmails)
        router.push("/")
      }
    }

    // Ejecutar verificación con un pequeño delay para evitar flickering
    timeoutId = setTimeout(checkAccess, 200)

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [user, loading, router])

  // Timeout de seguridad para evitar carga infinita
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (isChecking) {
        console.log("⚠️ Timeout de seguridad alcanzado, redirigiendo...")
        router.push("/")
      }
    }, 5000) // 5 segundos máximo

    return () => clearTimeout(safetyTimeout)
  }, [isChecking, router])

  // Mostrar loading mientras verifica
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div className="space-y-2">
            <p className="text-muted-foreground">Verificando acceso...</p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si tiene acceso, mostrar contenido
  if (hasAccess) {
    return <>{children}</>
  }

  // Fallback (no debería llegar aquí)
  return null
}

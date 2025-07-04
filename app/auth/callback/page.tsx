"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import supabase from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Procesar la respuesta de OAuth
        const { error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        // Obtener la URL de redirección si existe
        const redirectTo = searchParams?.get("redirect") || "/"

        // Redirigir al usuario
        console.log("Autenticación exitosa, redirigiendo a:", redirectTo)
        router.push(redirectTo)
      } catch (err: any) {
        console.error("Error en callback de autenticación:", err)
        setError(err.message || "Error al procesar la autenticación")
        // Redirigir al login después de un error
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error de autenticación</h2>
          <p className="mb-4">{error}</p>
          <p>Redirigiendo al inicio de sesión...</p>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Procesando tu inicio de sesión</h2>
          <p>Por favor espera mientras te redirigimos...</p>
        </div>
      )}
    </div>
  )
}

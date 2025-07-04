"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import supabase from "@/lib/supabase"
import { signToken, verifyToken } from "@/lib/jwt"
import { secureStorage } from "@/lib/secure-storage"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  token: string | null
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
  getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  const getTokenFromCookie = () => {
    if (typeof document === "undefined") return null
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1] || null
    )
  }

  const setTokenCookie = (jwtToken: string) => {
    if (typeof document !== "undefined") {
      document.cookie = `auth-token=${jwtToken}; path=/; max-age=86400; secure; samesite=lax`
    }
  }

  const clearTokenCookie = () => {
    if (typeof document !== "undefined") {
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    }
  }

  const getToken = async (): Promise<string | null> => {
    try {
      console.log("Obteniendo token...")

      const currentToken = getTokenFromCookie()
      if (currentToken && currentToken !== "undefined" && currentToken !== "null") {
        console.log("Token encontrado en cookie, verificando...")
        // Verificar si el token es válido
        const payload = await verifyToken(currentToken)
        if (payload) {
          console.log("Token válido")
          return currentToken
        } else {
          console.log("Token inválido, limpiando cookie")
          clearTokenCookie()
        }
      }

      // Si no hay token válido y hay usuario, crear uno nuevo
      if (user) {
        try {
          console.log("Creando nuevo token para usuario:", user.email)
          // Asegurarse de que el usuario no tenga propiedades undefined
          const cleanUser = JSON.parse(JSON.stringify(user))
          const newToken = await signToken(cleanUser)
          setTokenCookie(newToken)
          setToken(newToken)
          console.log("Nuevo token creado exitosamente")
          return newToken
        } catch (error) {
          console.error("Error creando nuevo token:", error)
          return null
        }
      }

      console.log("No hay usuario o token disponible")
      return null
    } catch (error) {
      console.error("Error obteniendo token:", error)
      return null
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Verificando sesión...")

        // Limpiar cualquier token inválido primero
        const cookieToken = getTokenFromCookie()
        if (cookieToken && (cookieToken === "undefined" || cookieToken === "null")) {
          clearTokenCookie()
        }

        // Verificar token JWT válido
        if (cookieToken && cookieToken !== "undefined" && cookieToken !== "null") {
          console.log("Verificando token existente...")
          const payload = await verifyToken(cookieToken)
          if (payload) {
            console.log("Token válido, estableciendo usuario:", payload.email)
            setUser(payload as User)
            setToken(cookieToken)
            setLoading(false)
            return
          } else {
            console.log("Token inválido, limpiando")
            // Token inválido, limpiar
            clearTokenCookie()
          }
        }

        // Fallback a Supabase session
        console.log("Verificando sesión de Supabase...")
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          console.log("Sesión de Supabase encontrada:", session.user.email)
          // Verificar si el usuario es admin (puedes ajustar esta lógica según tu sistema)
          const isAdmin = session.user.email === "hola@mail.com"

          const userData = {
            id: session.user.id,
            email: session.user.email || "",
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
            isAdmin: isAdmin,
          }

          // Crear JWT token
          const jwtToken = await signToken(userData)
          setTokenCookie(jwtToken)
          setToken(jwtToken)
          setUser(userData)
          console.log("Usuario establecido con nuevo token")
        } else {
          console.log("No hay sesión activa")
        }
      } catch (error) {
        console.error("Error al verificar sesión:", error)
        // En caso de error, limpiar todo
        clearTokenCookie()
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Cambio de estado de auth:", event)

      if (event === "SIGNED_IN" && session) {
        // Verificar si el usuario es admin (puedes ajustar esta lógica según tu sistema)
        const isAdmin = session.user.email === "hola@mail.com"

        const userData = {
          id: session.user.id,
          email: session.user.email || "",
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
          isAdmin: isAdmin,
        }

        // Crear JWT token
        const jwtToken = await signToken(userData)
        setTokenCookie(jwtToken)
        setToken(jwtToken)
        setUser(userData)
        console.log("Usuario logueado:", userData.email)

        // Redirigir después del login con Google
        if (typeof window !== "undefined") {
          const redirect = localStorage.getItem("redirectAfterLogin") || "/"
          localStorage.removeItem("redirectAfterLogin")
          router.push(redirect)
        }
      } else if (event === "SIGNED_OUT") {
        console.log("Usuario deslogueado")
        // Limpiar token y datos seguros
        clearTokenCookie()
        secureStorage.clearSecureData()
        setToken(null)
        setUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log("Iniciando sesión para:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Verificar si el usuario es admin (puedes ajustar esta lógica según tu sistema)
        const isAdmin = data.user.email === "hola@mail.com"

        const userData = {
          id: data.user.id,
          email: data.user.email || "",
          full_name: data.user.user_metadata?.full_name || "",
          isAdmin: isAdmin,
        }

        // Crear JWT token
        const jwtToken = await signToken(userData)
        setTokenCookie(jwtToken)
        setToken(jwtToken)
        setUser(userData)
        console.log("Sesión iniciada exitosamente")
      }
    } catch (error) {
      console.error("Error en handleSignIn:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignInWithGoogle = async () => {
    try {
      setLoading(true)
      console.log("Iniciando sesión con Google...")

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      console.log("Redirección a Google iniciada")
    } catch (error) {
      console.error("Error en handleSignInWithGoogle:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      })

      if (error) throw error
    } catch (error) {
      console.error("Error en handleSignUp:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Limpiar token y datos seguros
      clearTokenCookie()
      secureStorage.clearSecureData()
      setToken(null)
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Error en handleSignOut:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        signIn: handleSignIn,
        signInWithGoogle: handleSignInWithGoogle,
        signUp: handleSignUp,
        signOut: handleSignOut,
        setUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

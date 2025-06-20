"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signToken, verifyToken } from "@/lib/jwt"
import { secureStorage } from "@/lib/secure-storage"
import { tabSync } from "@/lib/tab-sync"
import type { User } from "@/types"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import supabase from "@/lib/supabase"

interface AuthContextType {
  user: SupabaseUser | null
  loading: boolean
  signOut: () => Promise<void>
  isAdmin: boolean
  token: string | null
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  setUser: (user: User | null) => void
  getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isAdmin: false,
  token: null,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signUp: async () => {},
  setUser: () => {},
  getToken: async () => null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
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
      console.log(`[${tabSync.getTabId()}] Obteniendo token...`)

      const currentToken = getTokenFromCookie()
      if (currentToken && currentToken !== "undefined" && currentToken !== "null") {
        console.log(`[${tabSync.getTabId()}] Token encontrado en cookie, verificando...`)
        // Verificar si el token es válido
        const payload = await verifyToken(currentToken)
        if (payload) {
          console.log(`[${tabSync.getTabId()}] Token válido`)
          return currentToken
        } else {
          console.log(`[${tabSync.getTabId()}] Token inválido, limpiando cookie`)
          clearTokenCookie()
        }
      }

      // Si no hay token válido y hay usuario, crear uno nuevo
      if (user) {
        try {
          console.log(`[${tabSync.getTabId()}] Creando nuevo token para usuario:`, user.email)
          // Asegurarse de que el usuario no tenga propiedades undefined
          const cleanUser = JSON.parse(JSON.stringify(user))
          const newToken = await signToken(cleanUser)
          setTokenCookie(newToken)
          setToken(newToken)
          console.log(`[${tabSync.getTabId()}] Nuevo token creado exitosamente`)
          return newToken
        } catch (error) {
          console.error(`[${tabSync.getTabId()}] Error creando nuevo token:`, error)
          return null
        }
      }

      console.log(`[${tabSync.getTabId()}] No hay usuario o token disponible`)
      return null
    } catch (error) {
      console.error(`[${tabSync.getTabId()}] Error obteniendo token:`, error)
      return null
    }
  }

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)

        if (session?.user) {
          // Verificar si es admin
          const adminEmails = ["hola@mail.com", "arianfabricioguilar@gmail.com"]
          setIsAdmin(adminEmails.includes(session.user.email || ""))
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event)
      setUser(session?.user ?? null)

      if (session?.user) {
        const adminEmails = ["hola@mail.com", "arianfabricioguilar@gmail.com"]
        setIsAdmin(adminEmails.includes(session.user.email || ""))
      } else {
        setIsAdmin(false)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log(`[${tabSync.getTabId()}] Iniciando sesión para:`, email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Verificar si el usuario es admin (puedes ajustar esta lógica según tu sistema)
        const isAdminCheck = data.user.email === "hola@mail.com"

        const userData = {
          id: data.user.id,
          email: data.user.email || "",
          full_name: data.user.user_metadata?.full_name || "",
          isAdmin: isAdminCheck,
        }

        // Crear JWT token
        const jwtToken = await signToken(userData)
        setTokenCookie(jwtToken)
        setToken(jwtToken)
        setUser(data.user)
        setIsAdmin(adminEmails.includes(data.user.email || ""))
        tabSync.syncAuth({ user: userData, token: jwtToken })
        console.log(`[${tabSync.getTabId()}] Sesión iniciada exitosamente`)
      }
    } catch (error) {
      console.error(`[${tabSync.getTabId()}] Error en handleSignIn:`, error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignInWithGoogle = async () => {
    try {
      setLoading(true)
      console.log(`[${tabSync.getTabId()}] Iniciando sesión con Google...`)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      console.log(`[${tabSync.getTabId()}] Redirección a Google iniciada`)
    } catch (error) {
      console.error(`[${tabSync.getTabId()}] Error en handleSignInWithGoogle:`, error)
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
      console.error(`[${tabSync.getTabId()}] Error en handleSignUp:`, error)
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
      setIsAdmin(false)
      tabSync.syncAuth({ user: null, token: null })
      router.push("/")
    } catch (error) {
      console.error(`[${tabSync.getTabId()}] Error en handleSignOut:`, error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const adminEmails = ["hola@mail.com", "arianfabricioguilar@gmail.com"]

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        isAdmin,
        token,
        signIn: handleSignIn,
        signInWithGoogle: handleSignInWithGoogle,
        signUp: handleSignUp,
        setUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

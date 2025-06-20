"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { signToken, verifyToken } from "@/lib/jwt"
import { secureStorage } from "@/lib/secure-storage"
import { tabSync } from "@/lib/tab-sync"
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
    const checkSession = async () => {
      try {
        console.log(`[${tabSync.getTabId()}] Verificando sesión... (Líder: ${tabSync.getIsLeader()})`)

        // Solo la pestaña líder maneja la autenticación inicial
        if (!tabSync.getIsLeader()) {
          console.log(`[${tabSync.getTabId()}] No soy líder, esperando sincronización...`)
          setLoading(false)
          return
        }

        // Limpiar cualquier token inválido primero
        const cookieToken = getTokenFromCookie()
        if (cookieToken && (cookieToken === "undefined" || cookieToken === "null")) {
          clearTokenCookie()
        }

        // Verificar token JWT válido
        if (cookieToken && cookieToken !== "undefined" && cookieToken !== "null") {
          console.log(`[${tabSync.getTabId()}] Verificando token existente...`)
          const payload = await verifyToken(cookieToken)
          if (payload) {
            console.log(`[${tabSync.getTabId()}] Token válido, estableciendo usuario:`, payload.email)
            setUser(payload as User)
            setToken(cookieToken)
            tabSync.syncAuth({ user: payload, token: cookieToken })
            setLoading(false)
            return
          } else {
            console.log(`[${tabSync.getTabId()}] Token inválido, limpiando`)
            // Token inválido, limpiar
            clearTokenCookie()
          }
        }

        // Fallback a Supabase session
        console.log(`[${tabSync.getTabId()}] Verificando sesión de Supabase...`)
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          console.log(`[${tabSync.getTabId()}] Sesión de Supabase encontrada:`, session.user.email)
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
          tabSync.syncAuth({ user: userData, token: jwtToken })
          console.log(`[${tabSync.getTabId()}] Usuario establecido con nuevo token`)
        } else {
          console.log(`[${tabSync.getTabId()}] No hay sesión activa`)
        }
      } catch (error) {
        console.error(`[${tabSync.getTabId()}] Error al verificar sesión:`, error)
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
      console.log(`[${tabSync.getTabId()}] Cambio de estado de auth:`, event)

      // Solo la pestaña líder maneja los cambios de auth
      if (!tabSync.getIsLeader()) {
        return
      }

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
        tabSync.syncAuth({ user: userData, token: jwtToken })
        console.log(`[${tabSync.getTabId()}] Usuario logueado:`, userData.email)

        // Redirigir después del login con Google
        if (typeof window !== "undefined") {
          const redirect = localStorage.getItem("redirectAfterLogin") || "/"
          localStorage.removeItem("redirectAfterLogin")
          router.push(redirect)
        }
      } else if (event === "SIGNED_OUT") {
        console.log(`[${tabSync.getTabId()}] Usuario deslogueado`)
        // Limpiar token y datos seguros
        clearTokenCookie()
        secureStorage.clearSecureData()
        setToken(null)
        setUser(null)
        tabSync.syncAuth({ user: null, token: null })
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

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
      tabSync.syncAuth({ user: null, token: null })
      router.push("/")
    } catch (error) {
      console.error(`[${tabSync.getTabId()}] Error en handleSignOut:`, error)
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

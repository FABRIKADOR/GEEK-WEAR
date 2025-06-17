import supabase from "./supabase"
import type { User } from "../types"

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Error en signIn:", error)
    throw error
  }

  return data
}

export async function signUp(email: string, password: string, metadata?: { full_name?: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })

  if (error) {
    console.error("Error en signUp:", error)
    throw error
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error en signOut:", error)
    throw error
  }

  return true
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error al obtener sesión:", error)
      return null
    }

    if (!session) {
      return null
    }

    // Devolver solo la información básica del usuario de la sesión
    return {
      id: session.user.id,
      email: session.user.email || "",
      full_name: session.user.user_metadata?.full_name,
    }
  } catch (error) {
    console.error("Error en getCurrentUser:", error)
    return null
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) {
    console.error("Error en resetPassword:", error)
    throw error
  }

  return true
}

export async function updateProfile(user: Partial<User>) {
  if (!user.id) {
    throw new Error("ID de usuario requerido")
  }

  // Actualizar solo los metadatos del usuario en lugar de la tabla profiles
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: user.full_name,
      avatar_url: user.avatar_url,
    },
  })

  if (error) {
    console.error("Error al actualizar perfil:", error)
    throw error
  }

  return {
    id: data.user.id,
    email: data.user.email || "",
    full_name: data.user.user_metadata?.full_name,
    avatar_url: data.user.user_metadata?.avatar_url,
  }
}

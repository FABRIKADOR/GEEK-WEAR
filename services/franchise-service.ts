import supabase from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { slugify } from "@/lib/utils"

export interface Franchise {
  id?: string
  name: string
  slug?: string
  description?: string | null
  image_url?: string | null
  type?: string | null
  created_at?: string
  updated_at?: string
}

export const franchiseService = {
  async getFranchises() {
    const { data, error } = await supabase.from("franchises").select("*").order("name")

    if (error) {
      console.error("Error al obtener franquicias:", error)
      throw error
    }

    return data
  },

  async getFranchiseById(id: string) {
    const { data, error } = await supabase.from("franchises").select("*").eq("id", id).single()

    if (error) {
      console.error("Error al obtener franquicia:", error)
      throw error
    }

    return data
  },

  async getFranchiseBySlug(slug: string) {
    const { data, error } = await supabase.from("franchises").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error al obtener franquicia:", error)
      throw error
    }

    return data
  },

  async createFranchise(franchise: Partial<Franchise>) {
    // Validar campos requeridos
    if (!franchise.name) {
      throw new Error("El nombre de la franquicia es obligatorio")
    }

    // Generar slug si no existe
    if (!franchise.slug) {
      franchise.slug = slugify(franchise.name)
    }

    // Crear objeto con valores por defecto
    const newFranchise = {
      id: uuidv4(),
      ...franchise,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("franchises").insert([newFranchise]).select().single()

    if (error) {
      console.error("Error al crear franquicia:", error)
      throw error
    }

    return data
  },

  async updateFranchise(id: string, franchise: Partial<Franchise>) {
    const { data, error } = await supabase
      .from("franchises")
      .update({
        ...franchise,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar franquicia:", error)
      throw error
    }

    return data
  },

  async deleteFranchise(id: string) {
    // Verificar si hay productos asociados a esta franquicia
    const { count, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("franchise_id", id)

    if (countError) {
      console.error("Error al verificar productos asociados:", countError)
      throw countError
    }

    // Si hay productos asociados, no permitir eliminar
    if (count && count > 0) {
      throw new Error(`No se puede eliminar la franquicia porque tiene ${count} productos asociados`)
    }

    // Eliminar la franquicia
    const { error } = await supabase.from("franchises").delete().eq("id", id)

    if (error) {
      console.error("Error al eliminar franquicia:", error)
      throw error
    }

    return true
  },
}

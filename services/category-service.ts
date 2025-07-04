import { supabase } from "@/lib/supabase-client"

export interface Category {
  id?: string
  name: string
  slug?: string
  description?: string
  image_url?: string
  parent_id?: string | null
  created_at?: string
  updated_at?: string
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching categories:", error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error in getCategories:", error)
      return []
    }
  },

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching category:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in getCategoryById:", error)
      return null
    }
  },

  async createCategory(category: Omit<Category, "id" | "created_at" | "updated_at">): Promise<Category> {
    try {
      // Generar slug a partir del nombre
      const slug = category.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remover acentos
        .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
        .replace(/\s+/g, "-") // Reemplazar espacios con guiones
        .trim()

      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            ...category,
            slug,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error creating category:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in createCategory:", error)
      throw error
    }
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    try {
      // Generar slug si el nombre ha cambiado
      const updateData: any = {
        ...category,
        updated_at: new Date().toISOString(),
      }

      if (category.name) {
        updateData.slug = category.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim()
      }

      const { data, error } = await supabase.from("categories").update(updateData).eq("id", id).select().single()

      if (error) {
        console.error("Error updating category:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in updateCategory:", error)
      throw error
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)

      if (error) {
        console.error("Error deleting category:", error)
        throw error
      }
    } catch (error) {
      console.error("Error in deleteCategory:", error)
      throw error
    }
  },

  // Función adicional para obtener categorías con sus subcategorías
  async getCategoriesWithChildren(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("parent_id", { ascending: true })
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching categories with children:", error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error in getCategoriesWithChildren:", error)
      return []
    }
  },
}

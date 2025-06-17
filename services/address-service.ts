import { supabase } from "@/lib/supabase-client"

export interface Address {
  id?: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  street_address: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

export const addressService = {
  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error al obtener direcciones:", error)
        return []
      }

      return data as Address[]
    } catch (error) {
      console.error("Error inesperado al obtener direcciones:", error)
      return []
    }
  },

  async createAddress(address: Omit<Address, "id">): Promise<Address | null> {
    try {
      // Si es la dirección por defecto, quitar el default de las otras
      if (address.is_default) {
        await supabase.from("addresses").update({ is_default: false }).eq("user_id", address.user_id)
      }

      const { data, error } = await supabase.from("addresses").insert([address]).select().single()

      if (error) {
        console.error("Error al crear dirección:", error)
        return null
      }

      return data as Address
    } catch (error) {
      console.error("Error inesperado al crear dirección:", error)
      return null
    }
  },

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address | null> {
    try {
      // Si es la dirección por defecto, quitar el default de las otras
      if (updates.is_default) {
        await supabase.from("addresses").update({ is_default: false }).eq("user_id", updates.user_id)
      }

      const { data, error } = await supabase.from("addresses").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error al actualizar dirección:", error)
        return null
      }

      return data as Address
    } catch (error) {
      console.error("Error inesperado al actualizar dirección:", error)
      return null
    }
  },

  async deleteAddress(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("addresses").delete().eq("id", id)

      if (error) {
        console.error("Error al eliminar dirección:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error inesperado al eliminar dirección:", error)
      return false
    }
  },

  async getDefaultAddress(userId: string): Promise<Address | null> {
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .eq("is_default", true)
        .single()

      if (error) {
        console.error("Error al obtener dirección por defecto:", error)
        return null
      }

      return data as Address
    } catch (error) {
      console.error("Error inesperado al obtener dirección por defecto:", error)
      return null
    }
  },
}

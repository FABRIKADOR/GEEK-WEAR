import { supabase } from "@/lib/supabase-client"
import { storageService } from "./storage-service"

export const productImageService = {
  async getProductImages(productId: string) {
    try {
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("display_order", { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error al obtener imágenes del producto:", error)
      throw error
    }
  },

  async addProductImage(productId: string, file: File, isPrimary = false) {
    try {
      // 1. Subir la imagen a Storage
      const uploadResult = await storageService.uploadProductImage(file, productId)

      // 2. Obtener el orden máximo actual
      const { data: existingImages, error: orderError } = await supabase
        .from("product_images")
        .select("display_order")
        .eq("product_id", productId)
        .order("display_order", { ascending: false })
        .limit(1)

      if (orderError) {
        throw orderError
      }

      const maxOrder = existingImages && existingImages.length > 0 ? existingImages[0].display_order + 1 : 0

      // 3. Si es la primera imagen o se especifica como primaria, actualizar todas las demás a no primarias
      if (isPrimary) {
        const { error: updateError } = await supabase
          .from("product_images")
          .update({ is_primary: false })
          .eq("product_id", productId)

        if (updateError) {
          throw updateError
        }
      }

      // 4. Insertar el registro de la imagen en la base de datos
      const { data, error } = await supabase.from("product_images").insert({
        product_id: productId,
        url: uploadResult.url,
        storage_path: uploadResult.path,
        alt_text: file.name.split(".")[0], // Usar el nombre del archivo como texto alternativo
        is_primary: isPrimary,
        display_order: maxOrder,
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error al añadir imagen al producto:", error)
      throw error
    }
  },

  async updateProductImage(imageId: string, updates: any) {
    try {
      // Si estamos estableciendo esta imagen como primaria, primero actualizar todas las demás
      if (updates.is_primary) {
        // Primero obtener el product_id de esta imagen
        const { data: imageData, error: imageError } = await supabase
          .from("product_images")
          .select("product_id")
          .eq("id", imageId)
          .single()

        if (imageError) {
          throw imageError
        }

        // Actualizar todas las imágenes del mismo producto a no primarias
        const { error: updateError } = await supabase
          .from("product_images")
          .update({ is_primary: false })
          .eq("product_id", imageData.product_id)

        if (updateError) {
          throw updateError
        }
      }

      // Actualizar la imagen específica
      const { data, error } = await supabase.from("product_images").update(updates).eq("id", imageId)

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error al actualizar imagen:", error)
      throw error
    }
  },

  async deleteProductImage(imageId: string) {
    try {
      // 1. Obtener la información de la imagen
      const { data: imageData, error: fetchError } = await supabase
        .from("product_images")
        .select("*")
        .eq("id", imageId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      // 2. Eliminar el archivo de Storage
      if (imageData.storage_path) {
        await storageService.deleteProductImage(imageData.storage_path)
      }

      // 3. Eliminar el registro de la base de datos
      const { error: deleteError } = await supabase.from("product_images").delete().eq("id", imageId)

      if (deleteError) {
        throw deleteError
      }

      // 4. Si era la imagen principal, establecer otra como principal
      if (imageData.is_primary) {
        const { data: remainingImages, error: remainingError } = await supabase
          .from("product_images")
          .select("id")
          .eq("product_id", imageData.product_id)
          .order("display_order", { ascending: true })
          .limit(1)

        if (remainingError) {
          throw remainingError
        }

        if (remainingImages && remainingImages.length > 0) {
          await this.updateProductImage(remainingImages[0].id, { is_primary: true })
        }
      }

      return true
    } catch (error) {
      console.error("Error al eliminar imagen:", error)
      throw error
    }
  },

  async reorderProductImages(productId: string, imageIds: string[]) {
    try {
      // Actualizar el orden de cada imagen
      for (let i = 0; i < imageIds.length; i++) {
        const { error } = await supabase
          .from("product_images")
          .update({ display_order: i })
          .eq("id", imageIds[i])
          .eq("product_id", productId)

        if (error) {
          throw error
        }
      }

      return true
    } catch (error) {
      console.error("Error al reordenar imágenes:", error)
      throw error
    }
  },
}

import { supabase } from "@/lib/supabase-client"
import { v4 as uuidv4 } from "uuid"

// Nombres de los buckets
const PRODUCT_IMAGES_BUCKET = "product-images"
const PROFILE_IMAGES_BUCKET = "profile-images"

export const storageService = {
  async checkBucketExists(bucketName: string) {
    try {
      // Intentar obtener la URL pública como prueba de acceso
      const { data } = supabase.storage.from(bucketName).getPublicUrl("test")

      if (data?.publicUrl) {
        console.log(`Bucket ${bucketName} existe y es accesible`)
        return true
      }

      return false
    } catch (error) {
      console.error("Error al verificar bucket:", error)
      return false
    }
  },

  async uploadProductImage(file: File, productId: string) {
    try {
      console.log(`Subiendo imagen de producto para: ${productId}`)

      // Validar el tipo de archivo
      if (!file.type.startsWith("image/")) {
        throw new Error("El archivo debe ser una imagen")
      }

      // Limitar el tamaño a 5MB
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("La imagen no debe superar los 5MB")
      }

      // Generar un nombre único para el archivo
      const fileExt = file.name.split(".").pop()
      const fileName = `productos/${productId}/${uuidv4()}.${fileExt}`

      console.log(`Subiendo archivo: ${fileName}`)

      // Subir el archivo a Supabase Storage
      const { data, error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Error al subir imagen:", error)
        throw new Error(`Error al subir imagen: ${error.message}`)
      }

      console.log("Imagen subida correctamente:", data)

      // Obtener la URL pública del archivo
      const { data: urlData } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(fileName)

      return {
        path: fileName,
        url: urlData.publicUrl,
      }
    } catch (error) {
      console.error("Error al subir imagen:", error)
      throw error
    }
  },

  async uploadProfileImage(file: File, userId: string) {
    try {
      console.log(`Subiendo imagen de perfil para usuario: ${userId}`)

      // Validar el tipo de archivo
      if (!file.type.startsWith("image/")) {
        throw new Error("El archivo debe ser una imagen")
      }

      // Limitar el tamaño a 5MB
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("La imagen no debe superar los 5MB")
      }

      // Generar un nombre único para el archivo
      const fileExt = file.name.split(".").pop()
      const fileName = `perfiles/${userId}/avatar-${uuidv4()}.${fileExt}`

      console.log(`Subiendo archivo: ${fileName}`)

      // Eliminar imágenes anteriores del usuario
      try {
        const { data: existingFiles } = await supabase.storage.from(PROFILE_IMAGES_BUCKET).list(`perfiles/${userId}`)

        if (existingFiles && existingFiles.length > 0) {
          const filesToRemove = existingFiles.map((file) => `perfiles/${userId}/${file.name}`)
          await supabase.storage.from(PROFILE_IMAGES_BUCKET).remove(filesToRemove)
          console.log("Imágenes anteriores eliminadas")
        }
      } catch (error) {
        console.warn("No se pudieron eliminar imágenes anteriores:", error)
        // Continuar con la subida aunque falle la eliminación
      }

      // Subir el archivo a Supabase Storage
      const { data, error } = await supabase.storage.from(PROFILE_IMAGES_BUCKET).upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (error) {
        console.error("Error al subir imagen de perfil:", error)
        throw new Error(`Error al subir imagen: ${error.message}`)
      }

      console.log("Imagen subida correctamente:", data)

      // Obtener la URL pública del archivo
      const { data: urlData } = supabase.storage.from(PROFILE_IMAGES_BUCKET).getPublicUrl(fileName)

      return {
        path: fileName,
        url: urlData.publicUrl,
      }
    } catch (error) {
      console.error("Error al subir imagen de perfil:", error)
      throw error
    }
  },

  async deleteProductImage(filePath: string) {
    try {
      const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([filePath])

      if (error) {
        console.error("Error al eliminar imagen:", error)
        throw new Error(`Error al eliminar imagen: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error("Error al eliminar imagen:", error)
      throw error
    }
  },

  getPublicUrl(filePath: string) {
    const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filePath)
    return data.publicUrl
  },
}

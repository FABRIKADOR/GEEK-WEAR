import supabase from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { slugify } from "@/lib/utils"

export interface Product {
  id?: string
  name: string
  slug?: string
  description: string
  price: number
  compare_at_price?: number | null
  image_url?: string | null
  category_id: string
  // franchises_ids es solo para el formulario, no se guarda directamente en products
  franchises_ids?: string[]
  is_active?: boolean
  featured?: boolean
  created_at?: string
  updated_at?: string
  categories?: {
    name: string
    slug: string
  }
  images?: any[]
  // Datos que vienen de las relaciones
  product_franchises?: Array<{
    franchise_id: string
    franchises: {
      id: string
      name: string
      slug: string
      type: string
    }
  }>
}

export interface ProductFilter {
  category_id?: string
  franchise_id?: string
  featured?: boolean
  is_active?: boolean
  limit?: number
  offset?: number
}

export const productService = {
  async getProducts(filters: ProductFilter = {}) {
    let query = supabase
      .from("products")
      .select(`
        *,
        categories(name, slug),
        images:product_images(*),
        product_franchises(
          franchise_id,
          franchises(id, name, slug, type)
        )
      `)
      .order("created_at", { ascending: false })

    // Aplicar filtros
    if (filters.category_id) {
      query = query.eq("category_id", filters.category_id)
    }

    if (filters.franchise_id) {
      query = query.eq("franchise_id", filters.franchise_id)
    }

    if (filters.featured !== undefined) {
      query = query.eq("featured", filters.featured)
    }

    if (filters.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active)
    }

    // Paginación
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name, slug),
        images:product_images(*),
        product_franchises(
          franchise_id,
          franchises(id, name, slug)
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  },

  async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name, slug),
        images:product_images(*),
        product_franchises(
          franchise_id,
          franchises(id, name, slug)
        )
      `)
      .eq("slug", slug)
      .single()

    if (error) throw error
    return data
  },

  async createProduct(product: Product) {
    // Asegurarse de que todos los campos requeridos estén presentes
    if (!product.name || !product.price || !product.category_id) {
      throw new Error("Nombre, precio y categoría son obligatorios")
    }

    // Generar slug si no existe
    if (!product.slug) {
      product.slug = slugify(product.name)
    }

    // Asegurarse de que el precio sea un número positivo
    if (product.price < 0) {
      throw new Error("El precio debe ser mayor o igual a 0")
    }

    // Asegurarse de que compare_at_price sea mayor o igual que price si está presente
    if (
      product.compare_at_price !== null &&
      product.compare_at_price !== undefined &&
      product.compare_at_price < product.price
    ) {
      product.compare_at_price = product.price
    }

    // Asignar valores predeterminados para campos opcionales
    const { franchises_ids, ...productData } = product // Extraer franchises_ids del resto de datos
    const newProduct = {
      id: uuidv4(),
      ...productData, // Usar productData sin franchises_ids
      is_active: product.is_active !== undefined ? product.is_active : true,
      featured: product.featured !== undefined ? product.featured : false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("products").insert([newProduct]).select().single()

    if (error) {
      console.error("Error al crear producto:", error)
      throw error
    }

    // Si hay franquicias seleccionadas, crear las relaciones
    if (franchises_ids && franchises_ids.length > 0) {
      const franchiseRelations = franchises_ids.map((franchiseId) => ({
        product_id: data.id,
        franchise_id: franchiseId,
      }))

      const { error: franchiseError } = await supabase.from("product_franchises").insert(franchiseRelations)

      if (franchiseError) {
        console.error("Error al crear relaciones de franquicias:", franchiseError)
        // Opcional: eliminar el producto si falla la creación de relaciones
        // await supabase.from('products').delete().eq('id', data.id);
        // throw franchiseError;
      }
    }

    return data
  },

  async updateProduct(id: string, product: Partial<Product>) {
    // Asegurarse de que el precio sea un número positivo si está presente
    if (product.price !== undefined && product.price < 0) {
      throw new Error("El precio debe ser mayor o igual a 0")
    }

    // Asegurarse de que compare_at_price sea mayor o igual que price si ambos están presentes
    if (
      product.compare_at_price !== undefined &&
      product.price !== undefined &&
      product.compare_at_price < product.price
    ) {
      product.compare_at_price = product.price
    }

    // Extraer franchises_ids del resto de datos de actualización
    const { franchises_ids, ...updateData } = product

    const { data, error } = await supabase
      .from("products")
      .update({
        ...updateData, // Usar updateData sin franchises_ids
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Actualizar relaciones de franquicias si se proporcionan
    if (franchises_ids !== undefined) {
      // Eliminar relaciones existentes
      await supabase.from("product_franchises").delete().eq("product_id", id)

      // Crear nuevas relaciones si hay franquicias seleccionadas
      if (franchises_ids.length > 0) {
        const franchiseRelations = franchises_ids.map((franchiseId) => ({
          product_id: id,
          franchise_id: franchiseId,
        }))

        const { error: franchiseError } = await supabase.from("product_franchises").insert(franchiseRelations)

        if (franchiseError) {
          console.error("Error al actualizar relaciones de franquicias:", franchiseError)
          throw franchiseError
        }
      }
    }

    return data
  },

  async deleteProduct(id: string) {
    // Primero eliminar las imágenes asociadas
    const { data: images } = await supabase.from("product_images").select("storage_path").eq("product_id", id)

    if (images && images.length > 0) {
      // Eliminar archivos de Storage
      const filePaths = images.map((img) => img.storage_path).filter(Boolean)
      if (filePaths.length > 0) {
        await supabase.storage.from("product-images").remove(filePaths)
      }

      // Eliminar registros de imágenes
      await supabase.from("product_images").delete().eq("product_id", id)
    }

    // Finalmente eliminar el producto
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) throw error
    return true
  },
}

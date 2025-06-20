import supabase from "./supabase"
import type { Product, ProductWithDetails, Category, Tag, Franchise, Order, Address, Coupon } from "../types"

// Products
export async function getProducts(
  limit = 10,
  page = 1,
  categoryId?: string,
  franchiseId?: string,
  featured?: boolean,
  searchQuery?: string,
): Promise<{ data: ProductWithDetails[]; count: number }> {
  console.log("Fetching products with params:", { limit, page, categoryId, franchiseId, featured, searchQuery })

  try {
    // Validar parámetros de entrada
    if (page < 1) page = 1
    if (limit < 1) limit = 10
    if (limit > 100) limit = 100

    let query = supabase
      .from("products")
      .select(
        `
    *,
    categories!inner(id, name, slug, description, is_visible),
    images:product_images(*),
    product_franchises(
      franchise_id,
      franchises(id, name, slug)
    )
  `,
        { count: "exact" },
      )
      .eq("is_active", true)
      .eq("categories.is_visible", true)
      .order("created_at", { ascending: false })

    // Aplicar filtros solo si son válidos
    if (categoryId && categoryId !== "undefined") {
      console.log("Filtering by category ID:", categoryId)
      query = query.eq("category_id", categoryId)
    }

    if (franchiseId && franchiseId !== "undefined") {
      console.log("Filtering by franchise ID:", franchiseId)
      query = query.eq("franchise_id", franchiseId)
    }

    if (featured !== undefined) {
      query = query.eq("featured", featured)
    }

    if (searchQuery && searchQuery.trim() && searchQuery !== "undefined") {
      const cleanQuery = searchQuery.trim()
      query = query.or(`name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%`)
    }

    // Aplicar paginación
    query = query.range((page - 1) * limit, page * limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching products:", error)
      return { data: [], count: 0 }
    }

    console.log(`Found ${count || 0} products, returning ${data?.length || 0} items`)

    const productsWithDetails =
      data?.map((product) => {
        return {
          ...product,
          category: product.categories || null,
          variants: [],
          tags: [],
          franchises: product.product_franchises?.map((pf) => pf.franchises) || [],
        } as ProductWithDetails
      }) || []

    return {
      data: productsWithDetails,
      count: count || 0,
    }
  } catch (error) {
    console.error("Unexpected error fetching products:", error)
    return { data: [], count: 0 }
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
  *,
  categories!inner(id, name, slug, description, is_visible),
  images:product_images(*),
  product_franchises(
    franchise_id,
    franchises(id, name, slug)
  )
  `,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .eq("categories.is_visible", true) // Solo productos de categorías visibles
      .single()

    if (error) {
      console.error("Error al obtener producto:", error)
      return null
    }

    // Transformar para que coincida con ProductWithDetails
    const productWithDetails = {
      ...data,
      category: data.categories || null, // Asignar la categoría correctamente
      variants: [],
      tags: [],
      franchises: data.product_franchises?.map((pf) => pf.franchises) || [],
    } as ProductWithDetails

    return productWithDetails
  } catch (error) {
    console.error("Unexpected error fetching product:", error)
    return null
  }
}

export async function getProductById(id: string): Promise<ProductWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
  *,
  categories!inner(id, name, slug, description, is_visible),
  images:product_images(*),
  product_franchises(
    franchise_id,
    franchises(id, name, slug)
  )
  `,
      )
      .eq("id", id)
      .eq("categories.is_visible", true) // Solo productos de categorías visibles
      .single()

    if (error) {
      console.error("Error al obtener producto:", error)
      return null
    }

    // Transformar para que coincida con ProductWithDetails
    const productWithDetails = {
      ...data,
      category: data.categories || null, // Asignar la categoría correctamente
      variants: [],
      tags: [],
      franchises: data.product_franchises?.map((pf) => pf.franchises) || [],
    } as ProductWithDetails

    return productWithDetails
  } catch (error) {
    console.error("Unexpected error fetching product:", error)
    return null
  }
}

// Categories - Función para admin (todas las categorías)
export async function getCategories(): Promise<Category[]> {
  try {
    console.log("Fetching categories from database...")
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error al obtener categorías:", error)
      return []
    }

    console.log(`Found ${data.length} categories`)
    return data as Category[]
  } catch (error) {
    console.error("Error inesperado al obtener categorías:", error)
    return []
  }
}

// Nueva función para frontend público (solo categorías visibles)
export async function getVisibleCategories(): Promise<Category[]> {
  try {
    console.log("Fetching visible categories from database...")
    const { data, error } = await supabase.from("categories").select("*").eq("is_visible", true).order("name")

    if (error) {
      console.error("Error al obtener categorías visibles:", error)
      return []
    }

    console.log(`Found ${data.length} visible categories`)
    return data as Category[]
  } catch (error) {
    console.error("Error inesperado al obtener categorías visibles:", error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_visible", true) // Solo categorías visibles
      .single()

    if (error) {
      console.error("Error al obtener categoría:", error)
      return null
    }

    return data as Category
  } catch (error) {
    console.error("Unexpected error fetching category:", error)
    return null
  }
}

// Franchises
export async function getFranchises(): Promise<Franchise[]> {
  try {
    console.log("Fetching franchises from database...")
    const { data, error } = await supabase.from("franchises").select("*").order("name")

    if (error) {
      console.error("Error al obtener franquicias:", error)
      return []
    }

    console.log(`Found ${data.length} franchises`)
    return data as Franchise[]
  } catch (error) {
    console.error("Error inesperado al obtener franquicias:", error)
    return []
  }
}

export async function getFranchiseBySlug(slug: string): Promise<Franchise | null> {
  try {
    const { data, error } = await supabase.from("franchises").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error al obtener franquicia:", error)
      return null
    }

    return data as Franchise
  } catch (error) {
    console.error("Unexpected error fetching franchise:", error)
    return null
  }
}

// Tags
export async function getTags(): Promise<Tag[]> {
  try {
    const { data, error } = await supabase.from("tags").select("*").order("name")

    if (error) {
      console.error("Error al obtener etiquetas:", error)
      return []
    }

    return data as Tag[]
  } catch (error) {
    console.error("Unexpected error fetching tags:", error)
    return []
  }
}

// Orders
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      *,
      status:status_id(*),
      items:order_items(
        *,
        product:product_id(*),
        variant:variant_id(*)
      )
    `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al obtener pedidos:", error)
      return []
    }

    return data as Order[]
  } catch (error) {
    console.error("Unexpected error fetching orders:", error)
    return []
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      *,
      status:status_id(*),
      items:order_items(
        *,
        product:product_id(*),
        variant:variant_id(*)
      )
    `,
      )
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error al obtener pedido:", error)
      return null
    }

    return data as Order
  } catch (error) {
    console.error("Unexpected error fetching order:", error)
    return null
  }
}

// Addresses
export async function getUserAddresses(userId: string): Promise<Address[]> {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })

    if (error) {
      console.error("Error al obtener direcciones:", error)
      return []
    }

    return data as Address[]
  } catch (error) {
    console.error("Unexpected error fetching addresses:", error)
    return []
  }
}

// Coupons
export async function validateCoupon(code: string): Promise<Coupon | null> {
  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .single()

    if (error) {
      console.error("Error al validar cupón:", error)
      return null
    }

    return data as Coupon
  } catch (error) {
    console.error("Unexpected error validating coupon:", error)
    return null
  }
}

// Admin functions

export async function createProduct(product: Partial<Product>): Promise<Product | null> {
  try {
    // Primero, obtener el token de autenticación actual
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error("No hay sesión de usuario. Debe iniciar sesión como administrador.")
    }

    // Usar el token de autenticación para la operación
    const { data, error } = await supabase.from("products").insert([product]).select().single()

    if (error) {
      console.error("Error al crear producto:", error)
      throw error
    }

    return data as Product
  } catch (error) {
    console.error("Error al crear producto:", error)
    throw error
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    // Primero, obtener el token de autenticación actual
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error("No hay sesión de usuario. Debe iniciar sesión como administrador.")
    }

    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error al actualizar producto:", error)
      throw error
    }

    return data as Product
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    // Primero, obtener el token de autenticación actual
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error("No hay sesión de usuario. Debe iniciar sesión como administrador.")
    }

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error al eliminar producto:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    throw error
  }
}

export async function createCategory(category: Partial<Category>): Promise<Category | null> {
  try {
    // Primero, obtener el token de autenticación actual
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error("No hay sesión de usuario. Debe iniciar sesión como administrador.")
    }

    const { data, error } = await supabase.from("categories").insert([category]).select().single()

    if (error) {
      console.error("Error al crear categoría:", error)
      throw error
    }

    return data as Category
  } catch (error) {
    console.error("Error al crear categoría:", error)
    throw error
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  try {
    // Primero, obtener el token de autenticación actual
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error("No hay sesión de usuario. Debe iniciar sesión como administrador.")
    }

    const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error al actualizar categoría:", error)
      throw error
    }

    return data as Category
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    throw error
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    // Primero, obtener el token de autenticación actual
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error("No hay sesión de usuario. Debe iniciar sesión como administrador.")
    }

    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.error("Error al eliminar categoría:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    throw error
  }
}

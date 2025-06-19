import * as XLSX from "xlsx"
import { supabase } from "./supabase"

export interface ExportOptions {
  type: "products" | "orders" | "users" | "categories" | "franchises"
  filters?: {
    dateFrom?: string
    dateTo?: string
    category?: string
    franchise?: string
    status?: string
  }
  format?: "xlsx" | "csv"
}

export class ExcelExportService {
  static async exportData(options: ExportOptions): Promise<Buffer> {
    const { type, filters = {}, format = "xlsx" } = options

    let data: any[] = []
    let filename = ""

    switch (type) {
      case "products":
        data = await this.getProductsData(filters)
        filename = "productos"
        break
      case "orders":
        data = await this.getOrdersData(filters)
        filename = "pedidos"
        break
      case "users":
        data = await this.getUsersData(filters)
        filename = "usuarios"
        break
      case "categories":
        data = await this.getCategoriesData()
        filename = "categorias"
        break
      case "franchises":
        data = await this.getFranchisesData()
        filename = "franquicias"
        break
      default:
        throw new Error("Tipo de exportación no válido")
    }

    return this.generateExcelFile(data, filename, format)
  }

  private static async getProductsData(filters: any) {
    let query = supabase.from("products").select(`
        id,
        name,
        slug,
        price,
        compare_at_price,
        featured,
        is_active,
        created_at,
        categories(name),
        product_images(url, is_primary)
      `)

    if (filters.category) {
      query = query.eq("category_id", filters.category)
    }

    if (filters.dateFrom) {
      query = query.gte("created_at", filters.dateFrom)
    }

    if (filters.dateTo) {
      query = query.lte("created_at", filters.dateTo)
    }

    const { data, error } = await query

    if (error) throw error

    return (
      data?.map((product) => ({
        ID: product.id,
        Nombre: product.name,
        Slug: product.slug,
        Precio: `$${product.price}`,
        "Precio Comparación": product.compare_at_price ? `$${product.compare_at_price}` : "",
        Destacado: product.featured ? "Sí" : "No",
        Activo: product.is_active ? "Sí" : "No",
        Categoría: product.categories?.name || "",
        "Fecha Creación": new Date(product.created_at).toLocaleDateString("es-MX"),
        "Imagen Principal": product.product_images?.find((img) => img.is_primary)?.url || "",
      })) || []
    )
  }

  private static async getOrdersData(filters: any) {
    let query = supabase.from("orders").select(`
        id,
        order_number,
        subtotal,
        total,
        payment_status,
        created_at,
        profiles(full_name, email),
        order_statuses(name)
      `)

    if (filters.status) {
      query = query.eq("status_id", filters.status)
    }

    if (filters.dateFrom) {
      query = query.gte("created_at", filters.dateFrom)
    }

    if (filters.dateTo) {
      query = query.lte("created_at", filters.dateTo)
    }

    const { data, error } = await query

    if (error) throw error

    return (
      data?.map((order) => ({
        ID: order.id,
        "Número de Pedido": order.order_number,
        Cliente: order.profiles?.full_name || "",
        Email: order.profiles?.email || "",
        Subtotal: `$${order.subtotal}`,
        Total: `$${order.total}`,
        "Estado Pago": order.payment_status,
        "Estado Pedido": order.order_statuses?.name || "",
        Fecha: new Date(order.created_at).toLocaleDateString("es-MX"),
      })) || []
    )
  }

  private static async getUsersData(filters: any) {
    let query = supabase.from("profiles").select(`
        id,
        full_name,
        email,
        phone,
        is_admin,
        created_at
      `)

    if (filters.dateFrom) {
      query = query.gte("created_at", filters.dateFrom)
    }

    if (filters.dateTo) {
      query = query.lte("created_at", filters.dateTo)
    }

    const { data, error } = await query

    if (error) throw error

    return (
      data?.map((user) => ({
        ID: user.id,
        "Nombre Completo": user.full_name || "",
        Email: user.email,
        Teléfono: user.phone || "",
        Administrador: user.is_admin ? "Sí" : "No",
        "Fecha Registro": new Date(user.created_at).toLocaleDateString("es-MX"),
      })) || []
    )
  }

  private static async getCategoriesData() {
    const { data, error } = await supabase.from("categories").select("*")

    if (error) throw error

    return (
      data?.map((category) => ({
        ID: category.id,
        Nombre: category.name,
        Slug: category.slug,
        Descripción: category.description || "",
        "Fecha Creación": new Date(category.created_at).toLocaleDateString("es-MX"),
      })) || []
    )
  }

  private static async getFranchisesData() {
    const { data, error } = await supabase.from("franchises").select("*")

    if (error) throw error

    return (
      data?.map((franchise) => ({
        ID: franchise.id,
        Nombre: franchise.name,
        Slug: franchise.slug,
        Descripción: franchise.description || "",
        "Fecha Creación": new Date(franchise.created_at).toLocaleDateString("es-MX"),
      })) || []
    )
  }

  private static generateExcelFile(data: any[], filename: string, format: "xlsx" | "csv"): Buffer {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, filename)

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: format === "xlsx" ? "xlsx" : "csv",
    })

    return buffer
  }

  static getFileName(type: string, format = "xlsx"): string {
    const timestamp = new Date().toISOString().split("T")[0]
    const typeNames = {
      products: "productos",
      orders: "pedidos",
      users: "usuarios",
      categories: "categorias",
      franchises: "franquicias",
    }

    return `${typeNames[type as keyof typeof typeNames]}_${timestamp}.${format}`
  }
}

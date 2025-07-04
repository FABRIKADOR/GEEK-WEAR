import { supabase } from "@/lib/supabase-client"
import { v4 as uuidv4 } from "uuid"

export interface OrderItem {
  product_id: string
  variant_id?: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  id?: string
  user_id: string
  order_number: string
  status_id?: string
  subtotal: number
  discount?: number
  total: number
  shipping_cost: number
  shipping_method: string
  shipping_address: any
  payment_info: any
  items: OrderItem[]
  created_at?: string
  updated_at?: string
}

export const orderService = {
  async createOrder(orderData: Order): Promise<Order | null> {
    try {
      // Generar ID y número de orden si no existen
      const id = orderData.id || uuidv4()
      const orderNumber = orderData.order_number || `GW-${Date.now().toString().slice(-8)}`

      // Preparar datos de la orden - sin payment_info y shipping_address como JSON
      const order = {
        id,
        order_number: orderNumber,
        user_id: orderData.user_id,
        status_id: orderData.status_id || "processing", // Valor por defecto
        subtotal: orderData.subtotal,
        discount: orderData.discount || 0,
        total: orderData.total,
        shipping_cost: orderData.shipping_cost,
        shipping_method: orderData.shipping_method,
        // Omitimos shipping_address y payment_info por ahora
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Insertar la orden
      const { data, error } = await supabase.from("orders").insert([order]).select().single()

      if (error) {
        console.error("Error al crear orden:", error)
        throw error
      }

      // Insertar los items de la orden
      const orderItems = orderData.items.map((item) => ({
        id: uuidv4(),
        order_id: id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        created_at: new Date().toISOString(),
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        console.error("Error al crear items de la orden:", itemsError)
        throw itemsError
      }

      return {
        ...orderData,
        id,
        order_number: orderNumber,
      }
    } catch (error) {
      console.error("Error en createOrder:", error)
      throw error
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error al obtener órdenes:", error)
        throw error
      }

      // Transformar los datos para el formato esperado
      return data.map((order) => ({
        ...order,
        shipping_address: {}, // Placeholder para mantener la estructura
        payment_info: {}, // Placeholder para mantener la estructura
      }))
    } catch (error) {
      console.error("Error en getUserOrders:", error)
      return []
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*)
        `)
        .eq("id", id)
        .single()

      if (error) {
        console.error("Error al obtener orden:", error)
        return null
      }

      return {
        ...data,
        shipping_address: {}, // Placeholder para mantener la estructura
        payment_info: {}, // Placeholder para mantener la estructura
      }
    } catch (error) {
      console.error("Error en getOrderById:", error)
      return null
    }
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*)
        `)
        .eq("order_number", orderNumber)
        .single()

      if (error) {
        console.error("Error al obtener orden por número:", error)
        return null
      }

      return {
        ...data,
        shipping_address: {}, // Placeholder para mantener la estructura
        payment_info: {}, // Placeholder para mantener la estructura
      }
    } catch (error) {
      console.error("Error en getOrderByNumber:", error)
      return null
    }
  },
}

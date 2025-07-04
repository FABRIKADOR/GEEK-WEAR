import { MercadoPagoConfig, Preference } from "mercadopago"

// Configurar MercadoPago para México
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
  },
})

const preference = new Preference(client)

export interface MercadoPagoItem {
  id: string
  title: string
  description?: string
  quantity: number
  currency_id: string
  unit_price: number
}

export interface MercadoPagoPayer {
  name?: string
  surname?: string
  email?: string
  phone?: {
    area_code?: string
    number: string
  }
  address?: {
    street_name: string
    street_number: string
    zip_code: string
  }
}

export const mercadoPagoService = {
  async createPreference(data: {
    items: MercadoPagoItem[]
    payer?: MercadoPagoPayer
    external_reference?: string
  }) {
    try {
      console.log("Creando preferencia para México con datos:", JSON.stringify(data, null, 2))

      // Asegurar que todos los items usen MXN (Peso Mexicano)
      const validatedItems = data.items.map((item) => ({
        ...item,
        currency_id: "MXN",
        unit_price: Math.round(item.unit_price * 100) / 100, // Redondear a 2 decimales
      }))

      const response = await preference.create({
        body: {
          items: validatedItems,
          payer: data.payer,
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
          },
          auto_return: "approved",
          notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
          external_reference: data.external_reference,
          statement_descriptor: "GeekWear Mexico",
          expires: true,
          expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          payment_methods: {
            excluded_payment_methods: [],
            excluded_payment_types: [],
            installments: 12, // Hasta 12 meses sin intereses
          },
        },
      })

      console.log("✅ Preferencia creada exitosamente:", response.id)

      return {
        success: true,
        preference_id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
      }
    } catch (error) {
      console.error("❌ Error creando preferencia en MercadoPago:", error)
      return {
        success: false,
        error: error.message || "Error al crear preferencia de pago",
      }
    }
  },
}

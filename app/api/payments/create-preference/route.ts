import { type NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log("=== CREANDO PREFERENCIA PARA MÉXICO ===")

    // Verificar autenticación
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token de autenticación requerido" }, { status: 401 })
    }

    const supabaseToken = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(supabaseToken)

    if (authError || !user) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
    }

    const body = await request.json()
    const { items, payer, external_reference, shipping_cost } = body

    console.log("Datos recibidos:", { items, payer, shipping_cost })

    // Validar datos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items son requeridos" }, { status: 400 })
    }

    // Preparar items para MercadoPago México
    const allItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || item.title,
      quantity: item.quantity,
      currency_id: "MXN",
      unit_price: item.unit_price,
    }))

    // Agregar costo de envío
    if (shipping_cost && shipping_cost > 0) {
      allItems.push({
        id: "shipping",
        title: "Costo de Envío",
        description: "Envío a domicilio en México",
        quantity: 1,
        currency_id: "MXN",
        unit_price: shipping_cost,
      })
    }

    // Crear preferencia usando fetch directo a la API de MercadoPago
    const preferenceData = {
      items: allItems,
      payer: {
        name: payer?.firstName,
        surname: payer?.lastName,
        email: payer?.email || user.email,
        phone: payer?.phone
          ? {
              area_code: "52", // México
              number: payer.phone,
            }
          : undefined,
        address: payer?.streetAddress
          ? {
              street_name: payer.streetAddress,
              street_number: "1",
              zip_code: payer.postalCode,
            }
          : undefined,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
      external_reference: external_reference || `order_${user.id}_${Date.now()}`,
      statement_descriptor: "GeekWear Mexico",
      expires: true,
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
    }

    console.log("Enviando a MercadoPago:", JSON.stringify(preferenceData, null, 2))

    // Usar fetch directo a la API de MercadoPago
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preferenceData),
    })

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text()
      console.error("Error de MercadoPago:", errorText)
      throw new Error(`Error de MercadoPago: ${mpResponse.status} - ${errorText}`)
    }

    const mpData = await mpResponse.json()
    console.log("✅ Respuesta de MercadoPago:", mpData)

    return NextResponse.json({
      success: true,
      preference_id: mpData.id,
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point,
    })
  } catch (error) {
    console.error("❌ Error general:", error)
    return NextResponse.json({ error: "Error interno del servidor: " + error.message }, { status: 500 })
  }
}

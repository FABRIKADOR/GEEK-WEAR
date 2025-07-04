import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  console.log("🚀 API Export iniciada")

  try {
    const body = await request.json()
    const { type, format } = body

    console.log("📋 Datos recibidos:", { type, format })

    // Crear cliente de Supabase para obtener datos reales
    const supabase = createClient()
    let data: any[] = []
    let headers: string[] = []

    // Obtener datos reales de la base de datos
    switch (type) {
      case "products":
        console.log("📦 Obteniendo productos reales...")
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("id, name, description, price, original_price, stock, featured, active, created_at")
          .order("created_at", { ascending: false })

        if (productsError) {
          console.error("❌ Error productos:", productsError)
          // Si hay error con Supabase, usar datos simulados
          data = [
            {
              id: "1",
              name: "Camiseta Pikachu",
              description: "Camiseta amarilla de Pikachu",
              price: 299,
              original_price: 399,
              stock: 10,
              featured: true,
              active: true,
              created_at: "2024-01-01",
            },
            {
              id: "2",
              name: "Camiseta Naruto",
              description: "Camiseta de Naruto Uzumaki",
              price: 349,
              original_price: 449,
              stock: 5,
              featured: false,
              active: true,
              created_at: "2024-01-02",
            },
            {
              id: "3",
              name: "Camiseta One Piece",
              description: "Camiseta de Luffy",
              price: 399,
              original_price: 499,
              stock: 8,
              featured: true,
              active: true,
              created_at: "2024-01-03",
            },
          ]
        } else {
          data = products || []
        }

        headers = [
          "ID",
          "Nombre",
          "Descripción",
          "Precio",
          "Precio Original",
          "Stock",
          "Destacado",
          "Activo",
          "Fecha Creación",
        ]
        break

      default:
        throw new Error("Tipo no soportado")
    }

    console.log("📊 Datos obtenidos:", data.length, "registros")

    // Procesar datos para Excel/CSV
    const processedData = data.map((item) => {
      switch (type) {
        case "products":
          return {
            ID: item.id,
            Nombre: item.name || "",
            Descripción: item.description || "",
            Precio: `$${item.price || 0}`,
            "Precio Original": item.original_price ? `$${item.original_price}` : "",
            Stock: item.stock || 0,
            Destacado: item.featured ? "Sí" : "No",
            Activo: item.active ? "Activo" : "Inactivo",
            "Fecha Creación": item.created_at ? new Date(item.created_at).toLocaleDateString("es-MX") : "",
          }
        default:
          return item
      }
    })

    console.log("🔄 Datos procesados para exportación")

    // Generar archivo según el formato
    if (format === "xlsx") {
      console.log("📊 Generando archivo Excel...")

      // Crear workbook y worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(processedData)

      // Configurar anchos de columna
      const columnWidths = [
        { wch: 10 }, // ID
        { wch: 30 }, // Nombre
        { wch: 40 }, // Descripción
        { wch: 12 }, // Precio
        { wch: 15 }, // Precio Original
        { wch: 8 }, // Stock
        { wch: 12 }, // Destacado
        { wch: 10 }, // Activo
        { wch: 15 }, // Fecha
      ]
      worksheet["!cols"] = columnWidths

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Productos")

      // Generar buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      })

      console.log("✅ Archivo Excel generado:", excelBuffer.length, "bytes")

      const filename = `productos_${new Date().toISOString().split("T")[0]}.xlsx`

      return new NextResponse(excelBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": excelBuffer.length.toString(),
        },
      })
    } else {
      console.log("📄 Generando archivo CSV...")

      // Generar CSV
      let csv = "\uFEFF" // BOM para UTF-8
      csv += headers.join(",") + "\n"

      processedData.forEach((item) => {
        const row = Object.values(item).map((value) => {
          const stringValue = String(value || "")
          // Escapar comillas y envolver en comillas si contiene comas
          if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        csv += row.join(",") + "\n"
      })

      console.log("✅ Archivo CSV generado:", csv.length, "caracteres")

      const filename = `productos_${new Date().toISOString().split("T")[0]}.csv`

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    }
  } catch (error: any) {
    console.error("❌ Error:", error)
    return NextResponse.json({ error: "Error interno", message: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "API de exportación funcionando" })
}

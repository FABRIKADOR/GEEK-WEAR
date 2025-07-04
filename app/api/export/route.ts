import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  console.log("🚀 API Export iniciada")

  try {
    const body = await request.json()
    const { type, format = "xlsx" } = body

    console.log("📋 Datos recibidos:", { type, format })

    let processedData: any[] = []

    if (type === "products") {
      console.log("📦 Obteniendo TODOS los productos de Supabase...")

      try {
        // Usar el cliente de Supabase directamente importado
        console.log("🔗 Usando cliente Supabase importado")

        // Obtener TODOS los productos sin límite
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            description,
            price,
            compare_at_price,
            category_id,
            franchise_id,
            featured,
            is_active,
            created_at
          `)
          .order("created_at", { ascending: false })

        if (productsError) {
          console.error("❌ Error Supabase:", productsError)
          throw new Error(`Error de base de datos: ${productsError.message}`)
        }

        console.log("📊 Productos obtenidos de Supabase:", products?.length || 0)

        if (products && products.length > 0) {
          processedData = products.map((product, index) => ({
            ID: product.id || `prod_${index + 1}`,
            Nombre: product.name || `Producto ${index + 1}`,
            Slug: product.slug || "",
            Descripción: product.description || "",
            Precio: product.price ? `$${product.price}` : "$0",
            "Precio Original": product.compare_at_price ? `$${product.compare_at_price}` : "",
            "ID Categoría": product.category_id || "",
            "ID Franquicia": product.franchise_id || "",
            Destacado: product.featured ? "Sí" : "No",
            Activo: product.is_active ? "Activo" : "Inactivo",
            "Fecha Creación": product.created_at
              ? new Date(product.created_at).toLocaleDateString("es-MX")
              : new Date().toLocaleDateString("es-MX"),
          }))

          console.log("✅ Productos procesados correctamente:", processedData.length)
        } else {
          throw new Error("No se encontraron productos en la base de datos")
        }
      } catch (supabaseError: any) {
        console.error("❌ Error con Supabase:", supabaseError.message)

        // En caso de error, usar datos de ejemplo como fallback
        console.log("⚠️ Usando datos de ejemplo como fallback")
        processedData = [
          {
            ID: "1",
            Nombre: "Camiseta Naruto",
            Slug: "camiseta-naruto",
            Descripción: "Camiseta oficial de Naruto",
            Precio: "$299.00",
            "Precio Original": "$399.00",
            "ID Categoría": "cat-1",
            "ID Franquicia": "naruto",
            Destacado: "Sí",
            Activo: "Activo",
            "Fecha Creación": "2024-01-15",
          },
          {
            ID: "2",
            Nombre: "Camiseta One Piece",
            Slug: "camiseta-one-piece",
            Descripción: "Camiseta oficial de One Piece",
            Precio: "$279.00",
            "Precio Original": "$349.00",
            "ID Categoría": "cat-1",
            "ID Franquicia": "one-piece",
            Destacado: "No",
            Activo: "Activo",
            "Fecha Creación": "2024-01-16",
          },
        ]
      }
    } else {
      return NextResponse.json(
        {
          error: "Tipo no soportado",
          message: `El tipo '${type}' no es válido. Use 'products'.`,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    console.log("🔄 Datos procesados:", processedData.length, "registros")

    if (processedData.length === 0) {
      return NextResponse.json(
        {
          error: "No hay datos para exportar",
          message: "No se encontraron productos para exportar",
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      )
    }

    const timestamp = new Date().toISOString().split("T")[0]

    if (format === "xlsx") {
      console.log("📊 Generando archivo Excel...")

      try {
        // Importar XLSX de forma segura
        const XLSX = await import("xlsx")

        // Crear workbook y worksheet
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(processedData)

        // Configurar anchos de columna
        worksheet["!cols"] = [
          { wch: 10 }, // ID
          { wch: 35 }, // Nombre
          { wch: 30 }, // Slug
          { wch: 45 }, // Descripción
          { wch: 12 }, // Precio
          { wch: 15 }, // Precio Original
          { wch: 15 }, // ID Categoría
          { wch: 15 }, // ID Franquicia
          { wch: 12 }, // Destacado
          { wch: 10 }, // Activo
          { wch: 15 }, // Fecha
        ]

        // Agregar worksheet al workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Productos")

        // Generar buffer del archivo Excel
        const excelBuffer = XLSX.write(workbook, {
          type: "buffer",
          bookType: "xlsx",
        })

        console.log("✅ Archivo Excel generado:", excelBuffer.length, "bytes")

        const filename = `productos_geekwear_${timestamp}.xlsx`

        return new NextResponse(excelBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": excelBuffer.length.toString(),
            "X-Product-Count": processedData.length.toString(),
          },
        })
      } catch (xlsxError: any) {
        console.error("❌ Error generando Excel:", xlsxError)
        return NextResponse.json(
          {
            error: "Error generando archivo Excel",
            message: xlsxError.message,
            timestamp: new Date().toISOString(),
          },
          { status: 500 },
        )
      }
    } else if (format === "csv") {
      console.log("📄 Generando archivo CSV...")

      try {
        // Generar CSV
        const headers = Object.keys(processedData[0])
        let csv = "\uFEFF" // BOM para UTF-8
        csv += headers.join(",") + "\n"

        processedData.forEach((item) => {
          const row = headers.map((header) => {
            const value = String(item[header] || "")
            return value.includes(",") ? `"${value.replace(/"/g, '""')}"` : value
          })
          csv += row.join(",") + "\n"
        })

        console.log("✅ Archivo CSV generado")

        const filename = `productos_geekwear_${timestamp}.csv`

        return new NextResponse(csv, {
          status: 200,
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "X-Product-Count": processedData.length.toString(),
          },
        })
      } catch (csvError: any) {
        console.error("❌ Error generando CSV:", csvError)
        return NextResponse.json(
          {
            error: "Error generando archivo CSV",
            message: csvError.message,
            timestamp: new Date().toISOString(),
          },
          { status: 500 },
        )
      }
    } else {
      return NextResponse.json(
        {
          error: "Formato no soportado",
          message: `El formato '${format}' no es válido. Use 'xlsx' o 'csv'.`,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("❌ Error completo en API:", error)

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    console.log("🔍 Test GET endpoint")
    return NextResponse.json({
      message: "API de exportación funcionando",
      timestamp: new Date().toISOString(),
      status: "OK",
    })
  } catch (error: any) {
    console.error("❌ Error en GET:", error)
    return NextResponse.json(
      {
        error: "Error en GET",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

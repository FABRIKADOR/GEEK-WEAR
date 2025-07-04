import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🧪 Test simple endpoint")

    // Datos de prueba muy simples
    const testData = [
      { Nombre: "Producto 1", Precio: "$100" },
      { Nombre: "Producto 2", Precio: "$200" },
    ]

    // Generar CSV simple
    const csv = "Nombre,Precio\nProducto 1,$100\nProducto 2,$200"

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=test.csv",
      },
    })
  } catch (error: any) {
    console.error("❌ Error en test:", error)
    return NextResponse.json({ error: "Error en test", message: error.message }, { status: 500 })
  }
}

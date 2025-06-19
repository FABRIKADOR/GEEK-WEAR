import { NextResponse } from "next/server"

export async function GET() {
  console.log("🧪 Test endpoint llamado")

  try {
    // Crear un CSV simple de prueba
    const testData = [
      { id: 1, name: "Producto 1", price: 100 },
      { id: 2, name: "Producto 2", price: 200 },
    ]

    const csv = "ID,Nombre,Precio\n1,Producto 1,100\n2,Producto 2,200\n"

    console.log("✅ CSV de prueba generado")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="test.csv"',
      },
    })
  } catch (error) {
    console.error("❌ Error en test:", error)
    return NextResponse.json({ error: "Error en test" }, { status: 500 })
  }
}

export async function POST() {
  return GET() // Redirigir POST a GET para pruebas
}

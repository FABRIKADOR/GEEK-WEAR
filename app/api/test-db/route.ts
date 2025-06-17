import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET() {
  try {
    // Verificar la conexión a Supabase
    const { data: productsData, error: productsError } = await supabase.from("products").select("*").limit(5)

    if (productsError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Error al consultar productos",
          error: productsError,
        },
        { status: 500 },
      )
    }

    // Obtener categorías
    const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*")

    if (categoriesError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Error al consultar categorías",
          error: categoriesError,
        },
        { status: 500 },
      )
    }

    // Verificar relaciones
    const productCategoryIds = productsData.map((p) => p.category_id)
    const categoryIds = categoriesData.map((c) => c.id)

    const missingCategories = productCategoryIds.filter((id) => !categoryIds.includes(id))

    return NextResponse.json({
      status: "success",
      products: productsData,
      categories: categoriesData,
      analysis: {
        productCount: productsData.length,
        categoryCount: categoriesData.length,
        missingCategories: missingCategories.length > 0 ? missingCategories : "Ninguna",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Error inesperado",
        error: error.toString(),
      },
      { status: 500 },
    )
  }
}

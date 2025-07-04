import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET() {
  try {
    // Verificar la conexión a Supabase
    const { data: connectionTest, error: connectionError } = await supabase
      .from("products")
      .select("count(*)", { count: "exact" })

    if (connectionError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Error connecting to Supabase",
          error: connectionError,
        },
        { status: 500 },
      )
    }

    // Obtener información sobre las tablas
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("count(*)", { count: "exact" })

    const { data: categories, error: categoriesError } = await supabase.from("categories").select("*")

    const { data: franchises, error: franchisesError } = await supabase.from("franchises").select("*")

    // Obtener algunos productos para verificar
    const { data: sampleProducts, error: sampleError } = await supabase
      .from("products")
      .select("id, name, slug, category_id, franchise_id, is_active")
      .limit(5)

    return NextResponse.json({
      status: "success",
      connection: "OK",
      tables: {
        products: {
          count: products,
          error: productsError,
        },
        categories: {
          count: categories?.length,
          data: categories,
          error: categoriesError,
        },
        franchises: {
          count: franchises?.length,
          data: franchises,
          error: franchisesError,
        },
      },
      sampleProducts: {
        data: sampleProducts,
        error: sampleError,
      },
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Defined" : "Not defined",
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Defined" : "Not defined",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unexpected error",
        error: error.toString(),
      },
      { status: 500 },
    )
  }
}

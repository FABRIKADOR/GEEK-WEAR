"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/lib/database"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Product } from "@/types"

export default function ProductsContainer() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError(null)

        console.log("🔍 ProductsContainer: Iniciando carga de productos...")

        // Intentar cargar productos destacados primero
        const { data: featuredProducts, error: featuredError } = await getProducts(8, 1, undefined, undefined, true)

        console.log("📊 Productos destacados:", { data: featuredProducts, error: featuredError })

        if (featuredError) {
          console.warn("⚠️ Error cargando productos destacados:", featuredError)
          // Si falla, intentar cargar productos recientes
          const { data: recentProducts, error: recentError } = await getProducts(8, 1)

          console.log("📊 Productos recientes:", { data: recentProducts, error: recentError })

          if (recentError) {
            throw new Error("No se pudieron cargar los productos")
          }

          setProducts(recentProducts || [])
        } else {
          // Si hay productos destacados, usarlos
          if (featuredProducts && featuredProducts.length > 0) {
            console.log("✅ Usando productos destacados:", featuredProducts.length)
            setProducts(featuredProducts)
          } else {
            console.log("📝 No hay productos destacados, cargando recientes...")
            // Si no hay productos destacados, cargar productos recientes
            const { data: recentProducts } = await getProducts(8, 1)
            console.log("📊 Productos recientes obtenidos:", recentProducts?.length || 0)
            setProducts(recentProducts || [])
          }
        }
      } catch (err) {
        console.error("❌ Error en loadProducts:", err)
        setError("Error al cargar productos")
      } finally {
        setLoading(false)
        console.log("🏁 ProductsContainer: Carga finalizada")
      }
    }

    loadProducts()
  }, [])

  console.log("🎯 ProductsContainer render:", { loading, error, productsCount: products.length })

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-midnight-blue/50 rounded-lg p-6 animate-pulse">
            <div className="bg-gray-600 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-600 h-4 rounded mb-2"></div>
            <div className="bg-gray-600 h-4 rounded w-2/3 mb-2"></div>
            <div className="bg-gray-600 h-6 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-red-400 mb-2">Error de Conexión</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-cyber-blue/10 border border-cyber-blue/20 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-cyber-blue mb-4">¡Próximamente!</h3>
          <p className="text-gray-300 mb-6">Estamos preparando una increíble selección de juegos para ti.</p>
          <Link href="/productos">
            <Button className="bg-cyber-blue hover:bg-neon-green text-dark-slate font-bold">Explorar Catálogo</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

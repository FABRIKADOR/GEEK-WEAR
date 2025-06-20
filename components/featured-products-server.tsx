import { getProducts } from "@/lib/database"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getFeaturedProducts() {
  try {
    // Intentar productos destacados primero
    const { data: featuredProducts, error: featuredError } = await getProducts(8, 1, undefined, undefined, true)

    if (!featuredError && featuredProducts && featuredProducts.length > 0) {
      return featuredProducts
    }

    // Fallback a productos recientes
    const { data: recentProducts, error: recentError } = await getProducts(8, 1)

    if (!recentError && recentProducts) {
      return recentProducts
    }

    return []
  } catch (error) {
    console.error("Error loading featured products:", error)
    return []
  }
}

export default async function FeaturedProductsServer() {
  const products = await getFeaturedProducts()

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

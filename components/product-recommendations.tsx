"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import ProductCard from "./product-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductRecommendationsProps {
  categoryId?: string
  franchiseId?: string
  currentProductId: string
}

export default function ProductRecommendations({
  categoryId,
  franchiseId,
  currentProductId,
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Número de productos a mostrar por slide
  const productsPerSlide = 3
  // Número total de productos a cargar
  const totalProductsToLoad = 9

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        // Obtener productos aleatorios
        const { data: randomProducts, error } = await supabase
          .from("products")
          .select(`
            *,
            categories (
              id,
              name,
              slug
            ),
            franchises (
              id,
              name,
              slug
            ),
            product_images (
              id,
              url,
              is_primary,
              display_order
            )
          `)
          .eq("is_active", true)
          .neq("id", currentProductId)
          .order("created_at", { ascending: false })
          .limit(totalProductsToLoad)

        if (error) {
          console.error("Error fetching recommendations:", error)
          return
        }

        // Transformar los datos para que coincidan con la estructura esperada
        const transformedProducts = randomProducts.map((product) => ({
          ...product,
          images: product.product_images || [],
          categories: product.categories,
          franchise: product.franchises,
        }))

        setRecommendations(transformedProducts)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [currentProductId])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === Math.floor(recommendations.length / productsPerSlide) - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? Math.floor(recommendations.length / productsPerSlide) - 1 : prev - 1))
  }

  // Calcular el número total de slides
  const totalSlides = Math.ceil(recommendations.length / productsPerSlide)

  // Obtener los productos para el slide actual
  const currentProducts = recommendations.slice(currentSlide * productsPerSlide, (currentSlide + 1) * productsPerSlide)

  if (loading) {
    return (
      <div className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Artículos Relacionados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 aspect-square rounded-t-lg"></div>
              <div className="bg-purple-700 p-4 rounded-b-lg">
                <div className="h-4 bg-purple-600 rounded mb-2"></div>
                <div className="h-3 bg-purple-600 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-purple-600 rounded mb-4 w-1/3"></div>
                <div className="h-10 bg-white rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-6 mt-12 mb-16">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Artículos Relacionados</h2>

        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full" aria-label="Anterior">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full" aria-label="Siguiente">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${currentSlide === index ? "bg-purple-700" : "bg-gray-300"}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// También exportar como exportación nombrada para compatibilidad
export { ProductRecommendations }

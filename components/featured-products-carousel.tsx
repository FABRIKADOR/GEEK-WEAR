"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "./product-card"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price?: number
  image_url?: string
  images?: Array<{ url: string; is_primary?: boolean }>
  categories?: { name: string }
}

interface FeaturedProductsCarouselProps {
  products: Product[]
}

export default function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [randomizedProducts, setRandomizedProducts] = useState<Product[]>([])
  const [itemsPerView, setItemsPerView] = useState(4)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Randomizar productos al montar el componente
  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5)
      setRandomizedProducts(shuffled)
    }
  }, [products])

  // Responsive items per view - AJUSTADO PARA MÓVILES
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 768) {
        setItemsPerView(2)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3)
      } else {
        setItemsPerView(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto play
  useEffect(() => {
    if (isAutoPlaying && randomizedProducts.length > itemsPerView) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = randomizedProducts.length - itemsPerView
          return prev >= maxIndex ? 0 : prev + 1
        })
      }, 5000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, randomizedProducts.length, itemsPerView])

  if (!randomizedProducts || randomizedProducts.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 lg:py-20">
        <div className="animate-pulse">
          <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-white/60" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Productos Destacados</h2>
          <p className="text-white/80 text-sm sm:text-base">Cargando productos destacados...</p>
        </div>
      </div>
    )
  }

  // Si hay menos productos que items per view, mostrar todos sin carrusel
  if (randomizedProducts.length <= itemsPerView) {
    return (
      <div className="py-8 sm:py-12 lg:py-16">
        {/* Header mejorado - TAMAÑO AJUSTADO */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 relative px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">Productos Destacados</h2>
          <p className="text-lg sm:text-xl text-white/90 mt-2 sm:mt-3 font-medium">Los favoritos de nuestros geeks</p>
          <div className="flex justify-center mt-4 space-x-1 sm:space-x-2">
            {[...Array(5)].map((_, i) => (
              <Sparkles
                key={i}
                className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        <div className="px-4">
          <div
            className={`grid gap-6 sm:gap-8 lg:gap-10 ${
              randomizedProducts.length === 1
                ? "grid-cols-1 max-w-md mx-auto"
                : randomizedProducts.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto"
                  : randomizedProducts.length === 3
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {randomizedProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const maxIndex = Math.max(0, randomizedProducts.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  return (
    <div
      className="relative py-8 sm:py-12 lg:py-16"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Header mejorado - TAMAÑO AJUSTADO */}
      <div className="text-center mb-12 sm:mb-16 lg:mb-20 relative px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">Productos Destacados</h2>
        <p className="text-lg sm:text-xl text-white/90 mt-2 sm:mt-3 font-medium">Los favoritos de nuestros geeks</p>
        <div className="flex justify-center mt-4 space-x-1 sm:space-x-2">
          {[...Array(5)].map((_, i) => (
            <Sparkles
              key={i}
              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Slider Container - RESPONSIVE */}
      <div className="overflow-hidden px-4 sm:px-6">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
          }}
        >
          {randomizedProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-2 sm:px-3 lg:px-5"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <ProductCard product={product} featured />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls - RESPONSIVE */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm z-10 rounded-full border-white/30 w-10 h-10 sm:w-14 sm:h-14 shadow-xl hover:scale-110 transition-all duration-300"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
        <span className="sr-only">Anterior</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm z-10 rounded-full border-white/30 w-10 h-10 sm:w-14 sm:h-14 shadow-xl hover:scale-110 transition-all duration-300"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
        <span className="sr-only">Siguiente</span>
      </Button>

      {/* Dot Indicators - RESPONSIVE */}
      {maxIndex > 0 && (
        <div className="flex justify-center mt-6 sm:mt-10 space-x-2 sm:space-x-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "rounded-full transition-all duration-300 shadow-lg",
                index === currentIndex
                  ? "bg-white w-6 h-3 sm:w-10 sm:h-4 scale-110"
                  : "bg-white/40 hover:bg-white/60 w-3 h-3 sm:w-4 sm:h-4 hover:scale-110",
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

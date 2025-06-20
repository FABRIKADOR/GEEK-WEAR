"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getProducts } from "@/lib/database"
import { ArrowRight, Grid3X3, Gamepad2, Zap, Trophy } from "lucide-react"
import type { ProductWithDetails } from "@/types"

export default function HeroSection() {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [productImages, setProductImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Obtener productos y filtrar imágenes válidas
  useEffect(() => {
    async function fetchProductsAndImages() {
      try {
        setLoading(true)
        console.log("🔍 Cargando juegos e imágenes...")

        // Obtener solo 20 productos para evitar sobrecarga
        const { data: productsData } = await getProducts(20, 1)
        console.log("🎮 Juegos obtenidos:", productsData.length)
        setProducts(productsData)

        // Filtrar y recopilar solo las primeras 10 imágenes válidas
        const validImages: string[] = []

        for (const product of productsData) {
          if (validImages.length >= 10) break // Limitar a 10 imágenes

          // Agregar imagen principal del producto si existe y es válida
          if (product.image_url && isValidImageUrl(product.image_url)) {
            validImages.push(product.image_url)
          }

          // Agregar solo la primera imagen adicional si existe
          if (validImages.length < 10 && product.images && product.images.length > 0) {
            const firstImage = product.images[0]
            const imageUrl = firstImage.url || firstImage.image_url
            if (imageUrl && isValidImageUrl(imageUrl) && !validImages.includes(imageUrl)) {
              validImages.push(imageUrl)
            }
          }
        }

        console.log("🖼️ Imágenes válidas encontradas:", validImages.length)
        setProductImages(validImages)
      } catch (error) {
        console.error("💥 Error al cargar juegos:", error)
        setProductImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchProductsAndImages()
  }, [])

  // Función para validar URLs de imágenes
  const isValidImageUrl = (url: string): boolean => {
    if (!url || url.trim() === "") return false
    if (url.includes("placeholder")) return false
    if (url.includes("undefined") || url.includes("null")) return false

    // Verificar que tenga una extensión de imagen válida
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]
    const hasValidExtension = imageExtensions.some((ext) => url.toLowerCase().includes(ext))

    return hasValidExtension || url.startsWith("http")
  }

  // Solo duplicar una vez para el efecto infinito
  const infiniteImages = [...productImages, ...productImages]

  // Obtener categorías únicas de los productos
  const getUniqueCategories = () => {
    const categories = new Set<string>()
    products.forEach((product) => {
      if (product.category?.name) {
        categories.add(product.category.name)
      }
    })
    return Array.from(categories).slice(0, 5)
  }

  const categories = getUniqueCategories()

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-deep-space via-dark-slate to-midnight-blue text-white overflow-hidden min-h-[80vh] sm:min-h-[90vh] flex items-center w-full">
        <div className="w-full relative z-20 py-12 sm:py-20 md:py-32 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse space-y-6">
              <div className="h-12 sm:h-16 bg-cyber-blue/10 rounded-2xl mx-auto max-w-3xl"></div>
              <div className="h-6 sm:h-8 bg-neon-green/5 rounded-xl mx-auto max-w-2xl"></div>
              <div className="flex gap-4 justify-center">
                <div className="h-10 sm:h-12 w-32 sm:w-40 bg-cyber-blue/10 rounded-xl"></div>
                <div className="h-10 sm:h-12 w-32 sm:w-40 bg-neon-green/10 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-gradient-to-br from-deep-space via-dark-slate to-midnight-blue text-white overflow-hidden min-h-[80vh] sm:min-h-[90vh] flex items-center w-full">
      {/* Efectos de fondo gaming simplificados */}
      <div className="absolute inset-0 z-0 w-full">
        {/* Grid pattern más sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

        {/* Glowing orbs reducidos */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyber-blue/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-neon-green/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Overlay mejorado para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-deep-space/90 via-dark-slate/70 to-midnight-blue/90 z-10"></div>

        {/* Slider infinito simplificado */}
        {productImages.length > 0 && (
          <div className="absolute inset-0 opacity-30">
            {/* Solo 2 filas en lugar de 5 */}
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex h-1/2 w-full overflow-hidden"
                style={{
                  animation: `slideInfinite ${30 + rowIndex * 10}s linear infinite`,
                  animationDirection: rowIndex % 2 === 0 ? "normal" : "reverse",
                }}
              >
                {infiniteImages.map((imageUrl, index) => (
                  <div
                    key={`${rowIndex}-${index}`}
                    className="flex-shrink-0 w-24 sm:w-32 h-full relative overflow-hidden mx-1 rounded-lg opacity-60"
                  >
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="w-full relative z-20 py-12 sm:py-20 md:py-32 px-3 sm:px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Título principal */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-2 sm:mb-4 tracking-tight">
              <span className="text-white">Game</span>{" "}
              <span className="bg-gradient-to-r from-cyber-blue via-neon-green to-electric-purple bg-clip-text text-transparent">
                Vault
              </span>
            </h1>
            <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white/90 tracking-wide">
              Tu{" "}
              <span className="bg-gradient-to-r from-neon-green via-cyber-blue to-electric-purple bg-clip-text text-transparent">
                Arsenal
              </span>{" "}
              Gaming
            </h2>
          </div>

          {/* Subtítulo */}
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed text-gray-300 font-light px-2">
            Descubre nuestra colección de{" "}
            <span className="text-cyber-blue font-semibold">{products.length}+ juegos únicos</span>, membresías premium
            y contenido exclusivo para <span className="text-neon-green font-semibold">verdaderos gamers</span>
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-2">
            <Button
              asChild
              size="lg"
              className="group relative bg-gradient-to-r from-cyber-blue to-neon-green text-dark-slate hover:from-neon-green hover:to-cyber-blue font-semibold text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-cyber-blue/25 hover:scale-105 border-0 w-full sm:w-auto sm:min-w-[200px]"
            >
              <Link href="/productos">
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 transition-transform group-hover:scale-110" />
                Explorar Juegos
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 sm:ml-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="group relative bg-transparent text-white hover:bg-cyber-blue/10 font-semibold text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 rounded-xl transition-all duration-300 border-2 border-cyber-blue/50 hover:border-neon-green/50 backdrop-blur-sm w-full sm:w-auto sm:min-w-[200px] hover:shadow-lg hover:shadow-cyber-blue/20"
            >
              <Link href="/productos">
                <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 transition-transform group-hover:scale-110" />
                Ver Categorías
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 sm:ml-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Categorías */}
          {categories.length > 0 && (
            <div className="mb-12 sm:mb-16 px-2">
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 font-medium tracking-wide uppercase">
                Categorías Disponibles
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-cyber-blue/10 backdrop-blur-sm text-cyber-blue/90 rounded-full text-xs sm:text-sm font-medium border border-cyber-blue/20 hover:bg-neon-green/10 hover:border-neon-green/30 hover:text-neon-green transition-all duration-300 cursor-pointer"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2">
            <div className="group text-center backdrop-blur-md bg-cyber-blue/5 rounded-2xl p-4 sm:p-6 border border-cyber-blue/20 hover:bg-cyber-blue/10 hover:border-cyber-blue/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyber-blue/20">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2 group-hover:text-cyber-blue transition-colors">
                {products.length}+
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase flex items-center justify-center gap-1">
                <Gamepad2 className="w-3 h-3" />
                Juegos Únicos
              </div>
            </div>
            <div className="group text-center backdrop-blur-md bg-neon-green/5 rounded-2xl p-4 sm:p-6 border border-neon-green/20 hover:bg-neon-green/10 hover:border-neon-green/40 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/20">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2 group-hover:text-neon-green transition-colors">
                {productImages.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" />
                Contenido Premium
              </div>
            </div>
            <div className="group text-center backdrop-blur-md bg-electric-purple/5 rounded-2xl p-4 sm:p-6 border border-electric-purple/20 hover:bg-electric-purple/10 hover:border-electric-purple/40 transition-all duration-300 hover:shadow-lg hover:shadow-electric-purple/20">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2 group-hover:text-electric-purple transition-colors">
                {categories.length}+
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3" />
                Plataformas
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInfinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}

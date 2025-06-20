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

        // Obtener productos de la base de datos
        const { data: productsData } = await getProducts(100, 1)
        console.log("🎮 Juegos obtenidos:", productsData.length)
        setProducts(productsData)

        // Filtrar y recopilar solo imágenes válidas de productos
        const validImages: string[] = []

        productsData.forEach((product) => {
          // Agregar imagen principal del producto si existe y es válida
          if (product.image_url && isValidImageUrl(product.image_url)) {
            validImages.push(product.image_url)
          }

          // Agregar imágenes adicionales del producto si existen y son válidas
          if (product.images && product.images.length > 0) {
            product.images.forEach((img) => {
              const imageUrl = img.url || img.image_url
              if (imageUrl && isValidImageUrl(imageUrl) && !validImages.includes(imageUrl)) {
                validImages.push(imageUrl)
              }
            })
          }
        })

        // Filtrar duplicados y URLs vacías
        const uniqueValidImages = [...new Set(validImages)].filter(Boolean)

        console.log("🖼️ Imágenes válidas encontradas:", uniqueValidImages.length)
        setProductImages(uniqueValidImages)
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

  // Duplicar el array múltiples veces para crear el efecto infinito sin cortes
  const infiniteImages = [...productImages, ...productImages, ...productImages, ...productImages]

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
      {/* Efectos de fondo gaming */}
      <div className="absolute inset-0 z-0 w-full">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-48 h-48 bg-electric-purple/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Overlay mejorado para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-deep-space/80 via-dark-slate/60 to-midnight-blue/80 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-deep-space/70 via-transparent to-dark-slate/90 z-10"></div>

        {/* Contenedor del slider infinito */}
        {productImages.length > 0 && (
          <div className="infinite-slider-container h-full w-full opacity-60">
            {/* Múltiples filas de slider para llenar toda la pantalla */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="infinite-slider-row flex h-1/5 w-full"
                style={{
                  animationDelay: `${rowIndex * -3}s`,
                  animationDirection: rowIndex % 2 === 0 ? "normal" : "reverse",
                }}
              >
                {infiniteImages.map((imageUrl, index) => (
                  <div
                    key={`${rowIndex}-${index}`}
                    className="flex-shrink-0 w-32 sm:w-48 h-full relative overflow-hidden mx-1 sm:mx-2 rounded-lg sm:rounded-xl transform hover:scale-110 hover:z-20 transition-all duration-500 shadow-lg border border-cyber-blue/20"
                  >
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Juego ${index + 1}`}
                      className="w-full h-full object-cover hover:brightness-125 transition-all duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                      }}
                    />

                    {/* Overlay sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-slate/40 to-transparent hover:from-cyber-blue/20 transition-all duration-300"></div>

                    {/* Efecto de brillo al hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-blue/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 transform -skew-x-12"></div>

                    {/* Borde sutil */}
                    <div className="absolute inset-0 border border-cyber-blue/20 rounded-lg sm:rounded-xl hover:border-neon-green/40 transition-all duration-300"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Fallback si no hay imágenes */}
        {productImages.length === 0 && (
          <div className="h-full w-full bg-gradient-to-br from-deep-space via-dark-slate to-midnight-blue flex items-center justify-center">
            <div className="text-white/60 text-center">
              <div className="text-2xl mb-4">🎮</div>
              <div>Cargando biblioteca de juegos...</div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal mejorado */}
      <div className="w-full relative z-20 py-12 sm:py-20 md:py-32 px-3 sm:px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Título principal con mejor tipografía */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-2 sm:mb-4 tracking-tight">
              <span className="text-white">Game</span>{" "}
              <span className="bg-gradient-to-r from-cyber-blue via-neon-green to-electric-purple bg-clip-text text-transparent animate-glow">
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

          {/* Subtítulo mejorado */}
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed text-gray-300 font-light px-2">
            Descubre nuestra colección de{" "}
            <span className="text-cyber-blue font-semibold">{products.length}+ juegos únicos</span>, membresías premium
            y contenido exclusivo para <span className="text-neon-green font-semibold">verdaderos gamers</span>
          </p>

          {/* Botones profesionales mejorados */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-2">
            <Button
              asChild
              size="lg"
              className="group relative bg-gradient-to-r from-cyber-blue to-neon-green text-dark-slate hover:from-neon-green hover:to-cyber-blue font-semibold text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-cyber-blue/25 hover:scale-105 border-0 w-full sm:w-auto sm:min-w-[200px] animate-glow"
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

          {/* Categorías con diseño mejorado */}
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

          {/* Estadísticas con diseño más elegante */}
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

          {/* Indicador de scroll sutil */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
            <div className="w-6 h-10 border-2 border-cyber-blue/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-cyber-blue/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

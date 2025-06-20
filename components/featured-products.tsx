"use client"

import { useState, useEffect } from "react"
import { getProducts } from "../api/products"
import ProductCard from "./product-card"
import Loader from "./loader"

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        // Cambiar para obtener todos los productos activos, no solo los destacados
        const { data: productsData } = await getProducts(12, 1, {
          is_active: true,
          // Remover el filtro de featured: true para mostrar todos los productos
        })

        if (productsData && productsData.length > 0) {
          setProducts(productsData)
        } else {
          console.log("No se encontraron productos")
        }
      } catch (error) {
        console.error("Error al cargar productos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Últimos Lanzamientos</h2>
          <p className="text-gray-400 mb-8">Descubre los juegos más recientes</p>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FeaturedProducts

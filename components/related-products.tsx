"use client"

import { useEffect, useState } from "react"
import { productService } from "@/services/product-service"
import ProductCard from "./product-card"

export default function RelatedProducts({ categoryId, currentProductId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        setLoading(true)
        const data = await productService.getProducts({
          category_id: categoryId,
          is_active: true,
          limit: 4,
        })

        // Filtrar el producto actual
        const filteredProducts = data.filter((product) => product.id !== currentProductId)
        setProducts(filteredProducts.slice(0, 4))
      } catch (error) {
        console.error("Error al cargar productos relacionados:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRelatedProducts()
  }, [categoryId, currentProductId])

  if (loading) {
    return <div className="text-center py-6">Cargando productos relacionados...</div>
  }

  if (products.length === 0) {
    return <div className="text-center py-6">No hay productos relacionados disponibles</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

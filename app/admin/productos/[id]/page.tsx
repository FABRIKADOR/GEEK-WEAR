import { Suspense } from "react"
import { notFound } from "next/navigation"
import { productService } from "@/services/product-service"
import { productImageService } from "@/services/product-image-service"
import ProductForm from "../product-form"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  try {
    const [product, images] = await Promise.all([
      productService.getProductById(params.id),
      productImageService.getProductImages(params.id),
    ])

    if (!product) {
      return notFound()
    }

    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Editar Producto</h1>
        <Suspense fallback={<div>Cargando...</div>}>
          <ProductForm initialData={product} initialImages={images} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error al cargar el producto:", error)
    return notFound()
  }
}

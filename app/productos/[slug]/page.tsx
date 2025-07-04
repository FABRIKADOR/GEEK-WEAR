import { Suspense } from "react"
import { notFound } from "next/navigation"
import { productService } from "@/services/product-service"
import ProductDetail from "@/components/product-detail"
import RelatedProducts from "@/components/related-products"

export default async function ProductPage({ params }: { params: { slug: string } }) {
  try {
    const product = await productService.getProductBySlug(params.slug)

    if (!product) {
      return notFound()
    }

    return (
      <main className="py-8">
        <div className="container">
          <ProductDetail product={product} />

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
            <Suspense fallback={<div>Cargando productos relacionados...</div>}>
              <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
            </Suspense>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Error al cargar el producto:", error)
    return notFound()
  }
}

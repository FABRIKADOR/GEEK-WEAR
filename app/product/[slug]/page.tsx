import { notFound } from "next/navigation"
import Image from "next/image"
import { getProductBySlug } from "@/lib/database"
import { ProductAddToCart } from "@/components/product-add-to-cart"
import { ProductReviews } from "@/components/product-reviews"
import { ProductRecommendations } from "@/components/product-recommendations"
import { WishlistButton } from "@/components/wishlist-button"
import { ProductDescription } from "@/components/product-description"
import { Badge } from "@/components/ui/badge"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Producto No Encontrado - GeekWear",
    }
  }

  return {
    title: `${product.name} - GeekWear`,
    description: product.description || `Compra ${product.name} en GeekWear - Tu Destino de Moda Geek`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  // Calcular descuento si existe compare_at_price
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercentage = hasDiscount ? Math.round((1 - product.price / product.compare_at_price) * 100) : 0

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
        {/* Imagen del Producto */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={
                product.images[0]?.url ||
                `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(product.name) || "/placeholder.svg"}`
              }
              alt={product.name}
              fill
              className="object-contain p-4"
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={image.id} className="relative aspect-square overflow-hidden rounded-md border">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={`${product.name} - Imagen ${index + 1}`}
                    fill
                    className="object-cover cursor-pointer hover:opacity-75 transition-opacity"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalles del Producto */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex-1">{product.name}</h1>
              <WishlistButton productId={product.id} />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">${product.compare_at_price.toFixed(2)}</span>
                  <Badge variant="destructive" className="bg-red-500">
                    {discountPercentage}% OFF
                  </Badge>
                </>
              )}
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>
          </div>

          {/* Componente Add to Cart */}
          <ProductAddToCart product={product} />

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Categoría:</span>
              <span className="text-sm text-gray-600">{product.category?.name || "Sin categoría"}</span>
            </div>

            {product.franchise && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-medium text-gray-700">Franquicia:</span>
                <span className="text-sm text-gray-600">{product.franchise.name}</span>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-sm font-medium text-gray-700">Tags:</span>
                {product.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs de Información */}
      <div className="mb-6 sm:mb-12">
        <ProductDescription product={product} />
      </div>

      {/* Reseñas */}
      <div className="mb-6 sm:mb-12">
        <ProductReviews productId={product.id} />
      </div>

      {/* Productos Recomendados */}
      <div>
        <ProductRecommendations
          categoryId={product.category_id}
          franchiseId={product.franchise_id}
          currentProductId={product.id}
        />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { toast } = useToast()
  const { addItem } = useCart()

  // Preparar las imágenes del producto
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
        ? [{ id: "main", url: product.image_url, is_primary: true }]
        : [{ id: "placeholder", url: "/placeholder.svg?height=600&width=600", is_primary: true }]

  // Ordenar las imágenes (principal primero)
  const sortedImages = [...productImages].sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.display_order - b.display_order
  })

  const currentImage = sortedImages[selectedImageIndex]

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: currentImage.url,
      quantity,
    })

    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido al carrito`,
    })
  }

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <div className="relative aspect-square">
            <Image src={currentImage.url || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
          </div>
        </div>

        {sortedImages.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                  index === selectedImageIndex ? "border-grape" : "border-transparent"
                }`}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`${product.name} - Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-2">
          <Link href={`/categorias/${product.categories?.slug || "#"}`} className="text-sm text-grape hover:underline">
            {product.categories?.name || "Sin categoría"}
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        <div className="flex items-center space-x-3 mb-6">
          <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <>
              <span className="text-gray-400 line-through text-xl">${product.compare_at_price.toFixed(2)}</span>
              <span className="bg-rose text-white text-sm font-bold px-2 py-1 rounded">
                {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-24">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-grape focus:border-grape"
              />
            </div>

            <Button onClick={handleAddToCart} className="flex-1 bg-grape hover:bg-dark-blue text-white" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Añadir al Carrito
            </Button>
          </div>

          <div className="flex space-x-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Añadir a Favoritos
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
          </div>
        </div>

        <Tabs defaultValue="description" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Descripción</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="details" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Categoría</div>
                <div className="text-sm">{product.categories?.name || "Sin categoría"}</div>

                <div className="text-sm font-medium">SKU</div>
                <div className="text-sm">{product.id.substring(0, 8).toUpperCase()}</div>

                <div className="text-sm font-medium">Disponibilidad</div>
                <div className="text-sm">{product.is_active ? "En stock" : "Agotado"}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

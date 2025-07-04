"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { productService } from "@/services/product-service"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PencilIcon, TrashIcon, EyeIcon, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TableSkeleton } from "@/components/ui/skeleton"

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getProducts()
      setProducts(data)
    } catch (error) {
      console.error("Error al cargar productos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await productService.deleteProduct(id)
        toast({
          title: "Éxito",
          description: "Producto eliminado correctamente",
        })
        loadProducts()
      } catch (error) {
        console.error("Error al eliminar producto:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el producto",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return <TableSkeleton rows={6} cols={6} />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">No hay productos</h3>
                    <p className="text-gray-500 text-sm">Comienza creando tu primer producto</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              // Encontrar la imagen principal o usar la primera disponible
              const primaryImage =
                product.images && product.images.length > 0
                  ? product.images.find((img) => img.is_primary) || product.images[0]
                  : null

              const imageUrl = primaryImage?.url || product.image_url || "/placeholder.svg?height=40&width=40"

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      {product.images && product.images.length > 0 ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded-tl">
                            {product.images.length}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">{product.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${product.price.toFixed(2)}</div>
                      {product.compare_at_price && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${product.compare_at_price.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.categories?.name || "Sin categoría"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.is_active ? "default" : "secondary"}
                      className={product.is_active ? "bg-green-500" : ""}
                    >
                      {product.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                    {product.featured && (
                      <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-500">
                        Destacado
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-grape border-grape hover:bg-grape hover:text-white"
                      >
                        <Link href={`/admin/productos/${product.id}`}>
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-grape border-grape hover:bg-grape hover:text-white"
                      >
                        <Link href={`/productos/${product.slug}`} target="_blank">
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-rose border-rose hover:bg-rose hover:text-white"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

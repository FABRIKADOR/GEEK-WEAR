"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Upload, Star, StarOff, GripVertical, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { productImageService } from "@/services/product-image-service"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ProductImageManagerProps {
  productId: string
  initialImages?: any[]
  onImagesChange?: (images: any[]) => void
}

const SortableImage = ({ image, onSetPrimary, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-2 bg-white rounded-md border mb-2">
      <div className="cursor-move" {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>

      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={image.url || "/placeholder.svg"}
          alt={image.alt_text || "Imagen de producto"}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{image.alt_text || "Sin descripción"}</p>
        <p className="text-xs text-gray-500 truncate">{image.is_primary ? "Imagen principal" : "Imagen secundaria"}</p>
      </div>

      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSetPrimary(image.id)}
          disabled={image.is_primary}
          title={image.is_primary ? "Imagen principal" : "Establecer como principal"}
        >
          {image.is_primary ? (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ) : (
            <StarOff className="h-4 w-4 text-gray-400" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(image.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          title="Eliminar imagen"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function ProductImageManager({
  productId,
  initialImages = [],
  onImagesChange,
}: ProductImageManagerProps) {
  const [images, setImages] = useState(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    if (productId) {
      loadImages()
    }
  }, [productId])

  const loadImages = async () => {
    if (!productId) return

    try {
      const data = await productImageService.getProductImages(productId)
      setImages(data)
      if (onImagesChange) onImagesChange(data)
    } catch (error) {
      console.error("Error al cargar imágenes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las imágenes",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !productId) return

    setIsUploading(true)
    setError(null)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
          await productImageService.addProductImage(productId, file, i === 0 && images.length === 0)
        } catch (err) {
          console.error("Error al subir imagen:", err)
          // Continuar con las siguientes imágenes incluso si una falla
        }
      }

      toast({
        title: "Imágenes subidas",
        description: "Las imágenes se han subido correctamente",
      })

      await loadImages()
    } catch (error) {
      console.error("Error al subir imágenes:", error)
      setError(error.message || "Error al subir imágenes")
      toast({
        title: "Error",
        description: error.message || "No se pudieron subir las imágenes",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    try {
      await productImageService.updateProductImage(imageId, { is_primary: true })
      await loadImages()

      toast({
        title: "Imagen principal",
        description: "Se ha establecido la imagen principal",
      })
    } catch (error) {
      console.error("Error al establecer imagen principal:", error)
      toast({
        title: "Error",
        description: "No se pudo establecer la imagen principal",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta imagen?")) return

    try {
      await productImageService.deleteProductImage(imageId)
      await loadImages()

      toast({
        title: "Imagen eliminada",
        description: "La imagen se ha eliminado correctamente",
      })
    } catch (error) {
      console.error("Error al eliminar imagen:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la imagen",
        variant: "destructive",
      })
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      // Reordenar localmente
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)

      const newImages = [...images]
      const [movedItem] = newImages.splice(oldIndex, 1)
      newImages.splice(newIndex, 0, movedItem)

      setImages(newImages)

      // Guardar el nuevo orden en la base de datos
      try {
        const imageIds = newImages.map((img) => img.id)
        await productImageService.reorderProductImages(productId, imageIds)

        if (onImagesChange) onImagesChange(newImages)
      } catch (error) {
        console.error("Error al reordenar imágenes:", error)
        toast({
          title: "Error",
          description: "No se pudo guardar el nuevo orden",
          variant: "destructive",
        })

        // Revertir al orden anterior
        await loadImages()
      }
    }
  }

  if (!productId) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p>Guarde el producto primero para gestionar imágenes</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="product-images">Imágenes del Producto</Label>

          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
              className="flex-1"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-grape hover:bg-dark-blue"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Subiendo..." : "Subir"}
            </Button>
          </div>

          <p className="text-sm text-gray-500">Puedes subir múltiples imágenes. La primera imagen será la principal.</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Imágenes Actuales</h3>

          {images.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No hay imágenes para este producto</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={images.map((img) => img.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {images.map((image) => (
                    <SortableImage
                      key={image.id}
                      image={image}
                      onSetPrimary={handleSetPrimary}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Arrastra y suelta para reordenar las imágenes. La imagen con la estrella es la principal.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

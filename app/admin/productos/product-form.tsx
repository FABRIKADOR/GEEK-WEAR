"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { productService, type Product } from "@/services/product-service"
import { categoryService } from "@/services/category-service"
import { franchiseService } from "@/services/franchise-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { slugify } from "@/lib/utils"
import ProductImageManager from "@/components/product-image-manager"

// Esquema de validación
const productSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  slug: z.string().min(3, { message: "El slug debe tener al menos 3 caracteres" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  price: z.coerce.number().min(0, { message: "El precio debe ser mayor o igual a 0" }),
  compare_at_price: z.coerce.number().min(0).optional().nullable(),
  category_id: z.string({ required_error: "La categoría es obligatoria" }),
  franchises_ids: z.array(z.string()).optional().default([]),
  is_active: z.boolean().default(true),
  featured: z.boolean().default(false),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: Product
  initialImages?: any[]
}

export default function ProductForm({ initialData, initialImages = [] }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState([])
  const [franchises, setFranchises] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [productImages, setProductImages] = useState(initialImages)
  const [tempProductId, setTempProductId] = useState<string | null>(null)
  const [showImageUpload, setShowImageUpload] = useState(!!initialData)
  const [productData, setProductData] = useState<Product | null>(initialData || null)
  const [formEditable, setFormEditable] = useState(true)

  // Extraer IDs de franquicias del producto inicial
  const initialFranchiseIds = initialData?.product_franchises?.map((pf) => pf.franchise_id) || []

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      price: 0,
      compare_at_price: null,
      category_id: "",
      franchises_ids: [],
      is_active: true,
      featured: false,
    },
  })

  // Actualizar los valores por defecto si hay datos iniciales
  useEffect(() => {
    if (initialData && initialFranchiseIds.length > 0) {
      form.setValue("franchises_ids", initialFranchiseIds)
    }
  }, [initialData, form])

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar categorías y franquicias en paralelo
        const [categoriesData, franchisesData] = await Promise.all([
          categoryService.getCategories(),
          franchiseService.getFranchises(),
        ])

        setCategories(categoriesData)
        setFranchises(franchisesData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las categorías o franquicias",
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [toast])

  // Generar slug automáticamente cuando cambia el nombre
  const watchName = form.watch("name")
  useEffect(() => {
    if (watchName && !initialData) {
      form.setValue("slug", slugify(watchName))
    }
  }, [watchName, form, initialData])

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true)

      // Si compare_at_price es menor que price, igualarlo a price
      if (data.compare_at_price !== null && data.compare_at_price < data.price) {
        data.compare_at_price = data.price
      }

      if (productData) {
        // Actualizar producto existente
        await productService.updateProduct(productData.id, data)
        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente",
        })

        // Actualizar datos del producto
        setProductData({
          ...productData,
          ...data,
        })
      } else {
        // Crear nuevo producto
        const newProduct = await productService.createProduct(data)
        toast({
          title: "Éxito",
          description: "Producto creado correctamente",
        })

        // Guardar el ID del producto para la carga de imágenes
        setTempProductId(newProduct.id)
        setProductData(newProduct)
        setShowImageUpload(true)

        // Cambiar a la pestaña de imágenes automáticamente
        setActiveTab("images")
      }

      router.refresh()
    } catch (error) {
      console.error("Error al guardar producto:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el producto",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImagesChange = (images) => {
    setProductImages(images)
  }

  // Función para actualizar el producto después de editar
  const handleUpdateProduct = async () => {
    await form.handleSubmit(onSubmit)()
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="images" disabled={!showImageUpload}>
            Imágenes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Camiseta Geek" {...field} disabled={!formEditable} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="camiseta-geek" {...field} disabled={!formEditable} />
                          </FormControl>
                          <FormDescription>URL amigable del producto (se genera automáticamente)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} disabled={!formEditable} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="compare_at_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio Comparativo</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              value={field.value === null ? "" : field.value}
                              onChange={(e) =>
                                field.onChange(e.target.value === "" ? null : Number.parseFloat(e.target.value))
                              }
                              disabled={!formEditable}
                            />
                          </FormControl>
                          <FormDescription>Precio original antes del descuento (opcional)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!formEditable}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="franchises_ids"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Franquicias</FormLabel>
                          <div className="space-y-4 max-h-60 overflow-y-auto border rounded-md p-4">
                            {/* Agrupar franquicias por tipo */}
                            {["anime", "videogame", "comic", "movie"].map((type) => {
                              const franchisesOfType = franchises.filter((f) => f.type === type)
                              if (franchisesOfType.length === 0) return null

                              return (
                                <div key={type} className="space-y-2">
                                  <h4 className="font-medium text-sm text-gray-700 capitalize border-b pb-1">
                                    {type === "videogame"
                                      ? "Videojuegos"
                                      : type === "anime"
                                        ? "Anime"
                                        : type === "comic"
                                          ? "Cómics"
                                          : "Películas"}
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {franchisesOfType.map((franchise) => (
                                      <div key={franchise.id} className="flex items-center space-x-2">
                                        <input
                                          type="checkbox"
                                          id={`franchise-${franchise.id}`}
                                          checked={field.value?.includes(franchise.id) || false}
                                          onChange={(e) => {
                                            const currentValues = field.value || []
                                            if (e.target.checked) {
                                              field.onChange([...currentValues, franchise.id])
                                            } else {
                                              field.onChange(currentValues.filter((id) => id !== franchise.id))
                                            }
                                          }}
                                          disabled={!formEditable}
                                          className="rounded border-gray-300"
                                        />
                                        <label
                                          htmlFor={`franchise-${franchise.id}`}
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                          {franchise.name}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                          <FormDescription>Selecciona las franquicias asociadas al producto (opcional)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe el producto..."
                                className="min-h-32"
                                {...field}
                                disabled={!formEditable}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Activo</FormLabel>
                            <FormDescription>Mostrar este producto en la tienda</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={!formEditable} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Destacado</FormLabel>
                            <FormDescription>Mostrar este producto en secciones destacadas</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={!formEditable} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/productos")}>
                  Cancelar
                </Button>
                {productData ? (
                  <>
                    <Button type="button" onClick={() => setActiveTab("images")} variant="outline">
                      Gestionar Imágenes
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formEditable}
                      className="bg-grape hover:bg-dark-blue"
                    >
                      {isSubmitting ? "Actualizando..." : "Actualizar Producto"}
                    </Button>
                  </>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="bg-grape hover:bg-dark-blue">
                    {isSubmitting ? "Guardando..." : "Crear Producto"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="images">
          {showImageUpload ? (
            <div className="space-y-6">
              <ProductImageManager
                productId={productData?.id || tempProductId}
                initialImages={productImages}
                onImagesChange={handleImagesChange}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveTab("general")
                    setFormEditable(true) // Asegurar que el formulario sea editable al volver
                  }}
                >
                  Volver a Información General
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push("/admin/productos")}
                  className="bg-grape hover:bg-dark-blue"
                >
                  Finalizar
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Guarda el producto primero para gestionar las imágenes</p>
              <Button onClick={() => setActiveTab("general")} className="mt-4">
                Volver a Información General
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

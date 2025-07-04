"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCategories, getFranchises, getTags, createProduct } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import type { Category, Franchise, Tag } from "@/types"
import { AdminCheck } from "@/components/admin-check"

export default function CreateProductPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compare_at_price: "",
    category_id: "",
    franchise_id: "",
    is_active: true,
    featured: false,
    selected_tags: [] as string[],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, franchisesData, tagsData] = await Promise.all([
          getCategories(),
          getFranchises(),
          getTags(),
        ])

        setCategories(categoriesData)
        setFranchises(franchisesData)
        setTags(tagsData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del formulario",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generar slug desde el nombre
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      selected_tags: prev.selected_tags.includes(tagId)
        ? prev.selected_tags.filter((id) => id !== tagId)
        : [...prev.selected_tags, tagId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.category_id) {
      toast({
        title: "Error de validación",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Formatear los datos para envío
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? Number.parseFloat(formData.compare_at_price) : null,
        category_id: formData.category_id,
        franchise_id: formData.franchise_id || null,
        is_active: formData.is_active,
        featured: formData.featured,
      }

      // Crear el producto
      const product = await createProduct(productData)

      if (product) {
        toast({
          title: "Producto creado",
          description: "El producto ha sido creado exitosamente",
        })

        // Redirigir a la página de edición para agregar variantes e imágenes
        router.push(`/admin/products/edit/${product.id}`)
      } else {
        throw new Error("No se pudo crear el producto")
      }
    } catch (error) {
      console.error("Error al crear producto:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el producto. Por favor intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Producto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nombre del Producto <span className="text-red-500">*</span>
                    </Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                    <p className="text-sm text-muted-foreground">Versión URL-amigable del nombre del producto</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Precios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">
                        Precio <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={handleChange}
                          className="pl-6"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="compare_at_price">Precio Comparativo</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          id="compare_at_price"
                          name="compare_at_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.compare_at_price}
                          onChange={handleChange}
                          className="pl-6"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">Precio original para mostrar descuentos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organización</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category_id">
                      Categoría <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => handleSelectChange("category_id", value)}
                    >
                      <SelectTrigger id="category_id">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="franchise_id">Franquicia</Label>
                    <Select
                      value={formData.franchise_id}
                      onValueChange={(value) => handleSelectChange("franchise_id", value)}
                    >
                      <SelectTrigger id="franchise_id">
                        <SelectValue placeholder="Seleccionar franquicia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Ninguna</SelectItem>
                        {franchises.map((franchise) => (
                          <SelectItem key={franchise.id} value={franchise.id}>
                            {franchise.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Etiquetas</Label>
                    <div className="border rounded-md p-3 space-y-2 max-h-[200px] overflow-y-auto">
                      {tags.map((tag) => (
                        <div key={tag.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag.id}`}
                            checked={formData.selected_tags.includes(tag.id)}
                            onCheckedChange={() => handleTagToggle(tag.id)}
                          />
                          <Label htmlFor={`tag-${tag.id}`} className="text-sm cursor-pointer">
                            {tag.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado y Visibilidad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active" className="cursor-pointer">
                      Activo
                    </Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured" className="cursor-pointer">
                      Destacado
                    </Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear Producto"}
            </Button>
          </div>
        </form>
      </div>
    </AdminCheck>
  )
}

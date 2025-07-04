"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AdminCheck } from "@/components/admin-check"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Tag, Eye, EyeOff } from "lucide-react"
import { categoryService, type Category } from "@/services/category-service"
import { toast } from "sonner"

export default function AdminCategoriesNewPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    is_visible: true,
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryService.getCategories()
      console.log("✅ Categorías cargadas (NEW):", data)
      setCategories(data)
    } catch (error) {
      console.error("❌ Error loading categories:", error)
      toast.error("Error al cargar las categorías")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("📝 Enviando formulario (NEW):", formData)

    if (!formData.name.trim()) {
      toast.error("El nombre es requerido")
      return
    }

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id!, formData)
        toast.success("Categoría actualizada exitosamente")
      } else {
        await categoryService.createCategory(formData)
        toast.success("Categoría creada exitosamente")
      }

      setFormData({ name: "", description: "", image_url: "", is_visible: true })
      setEditingCategory(null)
      setIsCreateOpen(false)
      loadCategories()
    } catch (error) {
      console.error("❌ Error saving category:", error)
      toast.error("Error al guardar la categoría")
    }
  }

  const handleEdit = (category: Category) => {
    console.log("✏️ Editando categoría (NEW):", category)
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
      is_visible: category.is_visible ?? true,
    })
    setIsCreateOpen(true)
  }

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    console.log("👁️ Cambiando visibilidad (NEW):", { id, currentVisibility })
    try {
      await categoryService.toggleCategoryVisibility(id, !currentVisibility)
      toast.success(`Categoría ${!currentVisibility ? "mostrada" : "ocultada"} exitosamente`)
      loadCategories()
    } catch (error) {
      console.error("❌ Error toggling visibility:", error)
      toast.error("Error al cambiar la visibilidad")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      return
    }

    try {
      await categoryService.deleteCategory(id)
      toast.success("Categoría eliminada exitosamente")
      loadCategories()
    } catch (error) {
      console.error("❌ Error deleting category:", error)
      toast.error("Error al eliminar la categoría")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", image_url: "", is_visible: true })
    setEditingCategory(null)
  }

  if (loading) {
    return (
      <AdminCheck>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        </div>
      </AdminCheck>
    )
  }

  return (
    <AdminCheck>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gestionar Categorías (Nueva Versión)</h1>
            <p className="text-sm text-muted-foreground">Con funcionalidad de visibilidad</p>
          </div>
          <Dialog
            open={isCreateOpen}
            onOpenChange={(open) => {
              console.log("🔄 Dialog state changed (NEW):", open)
              setIsCreateOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => console.log("➕ Botón Nueva Categoría clickeado (NEW)")}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Juegos AAA, Membresías, DLCs"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción de la categoría"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">URL de Imagen</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    type="url"
                  />
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/50">
                  <Switch
                    id="is_visible"
                    checked={formData.is_visible}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                  />
                  <Label htmlFor="is_visible" className="font-medium">
                    Visible en el sitio web
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    ({formData.is_visible ? "Se mostrará" : "Se ocultará"} en el ecommerce)
                  </span>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">{editingCategory ? "Actualizar" : "Crear"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Categorías ({categories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay categorías creadas</p>
                <p className="text-sm text-muted-foreground">Crea tu primera categoría para organizar tus productos</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-center">Visibilidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{category.slug}</code>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{category.description || "-"}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Switch
                            checked={category.is_visible ?? true}
                            onCheckedChange={() => handleToggleVisibility(category.id!, category.is_visible ?? true)}
                            size="sm"
                          />
                          <span className="text-xs text-muted-foreground">
                            {(category.is_visible ?? true) ? "Visible" : "Oculta"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={(category.is_visible ?? true) ? "default" : "secondary"}>
                          {(category.is_visible ?? true) ? "Activa" : "Oculta"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(category.created_at!).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleVisibility(category.id!, category.is_visible ?? true)}
                            title={(category.is_visible ?? true) ? "Ocultar categoría" : "Mostrar categoría"}
                          >
                            {(category.is_visible ?? true) ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(category.id!)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminCheck>
  )
}

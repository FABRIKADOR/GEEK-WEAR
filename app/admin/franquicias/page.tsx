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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Zap, Loader2 } from "lucide-react"
import { franchiseService, type Franchise } from "@/services/franchise-service"
import { toast } from "sonner"

export default function AdminFranchisesPage() {
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    type: "",
  })

  useEffect(() => {
    loadFranchises()
  }, [])

  const loadFranchises = async () => {
    try {
      setLoading(true)
      const data = await franchiseService.getFranchises()
      setFranchises(data)
    } catch (error) {
      console.error("Error loading franchises:", error)
      toast.error("Error al cargar las franquicias")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("El nombre es requerido")
      return
    }

    try {
      setSaving(true)
      if (editingFranchise) {
        await franchiseService.updateFranchise(editingFranchise.id!, formData)
        toast.success("Franquicia actualizada exitosamente")
      } else {
        await franchiseService.createFranchise(formData)
        toast.success("Franquicia creada exitosamente")
      }

      setFormData({ name: "", description: "", image_url: "", type: "" })
      setEditingFranchise(null)
      setIsCreateOpen(false)
      loadFranchises()
    } catch (error) {
      console.error("Error saving franchise:", error)
      toast.error("Error al guardar la franquicia")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (franchise: Franchise) => {
    setEditingFranchise(franchise)
    setFormData({
      name: franchise.name,
      description: franchise.description || "",
      image_url: franchise.image_url || "",
      type: franchise.type || "",
    })
    setIsCreateOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta franquicia?")) {
      return
    }

    try {
      await franchiseService.deleteFranchise(id)
      toast.success("Franquicia eliminada exitosamente")
      loadFranchises()
    } catch (error) {
      console.error("Error deleting franchise:", error)
      toast.error("Error al eliminar la franquicia")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", image_url: "", type: "" })
    setEditingFranchise(null)
  }

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case "anime":
        return "bg-pink-100 text-pink-800"
      case "videogame":
        return "bg-blue-100 text-blue-800"
      case "comic":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <AdminCheck>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </AdminCheck>
    )
  }

  return (
    <AdminCheck>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestionar Franquicias</h1>
          <Dialog
            open={isCreateOpen}
            onOpenChange={(open) => {
              setIsCreateOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Franquicia
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingFranchise ? "Editar Franquicia" : "Crear Nueva Franquicia"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Marvel, One Piece, Pokémon"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción de la franquicia"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="videogame">Videojuego</SelectItem>
                      <SelectItem value="comic">Cómic</SelectItem>
                      <SelectItem value="movie">Película</SelectItem>
                      <SelectItem value="tv">Serie de TV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="image_url">URL de Imagen</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://ejemplo.com/logo.jpg"
                    type="url"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingFranchise ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Franquicias ({franchises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {franchises.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay franquicias creadas</p>
                <p className="text-sm text-muted-foreground">
                  Crea tu primera franquicia para organizar tus productos por marca
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {franchises.map((franchise) => (
                    <TableRow key={franchise.id}>
                      <TableCell className="font-medium">{franchise.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{franchise.slug}</code>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{franchise.description || "-"}</TableCell>
                      <TableCell>
                        {franchise.type && (
                          <Badge variant="secondary" className={getTypeColor(franchise.type)}>
                            {franchise.type}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Activa</Badge>
                      </TableCell>
                      <TableCell>{new Date(franchise.created_at!).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(franchise)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(franchise.id!)}
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

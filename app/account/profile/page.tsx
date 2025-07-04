"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { User, Upload, X, Camera, Calendar, Phone, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { storageService } from "@/services/storage-service"
import { supabase } from "@/lib/supabase-client"

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    avatar_url: "",
    phone: "",
    birth_date: "",
    gender: "",
    bio: "",
    location: "",
  })

  // Actualizar el estado cuando cambia el usuario
  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    if (!user) return

    try {
      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error)
        return
      }

      if (profile) {
        setFormData({
          full_name: profile.full_name || "",
          username: profile.username || "",
          email: profile.email || user.email || "",
          avatar_url: profile.avatar_url || "",
          phone: profile.phone || "",
          birth_date: profile.birth_date || "",
          gender: profile.gender || "",
          bio: profile.bio || "",
          location: profile.location || "",
        })

        if (profile.avatar_url) {
          setPreviewImage(profile.avatar_url)
        }
      } else {
        // Si no existe perfil, usar datos básicos del usuario
        setFormData({
          full_name: user.user_metadata?.full_name || "",
          username: "",
          email: user.email || "",
          avatar_url: "",
          phone: "",
          birth_date: "",
          gender: "",
          bio: "",
          location: "",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Si se actualiza la URL manualmente, actualizar la previsualización
    if (name === "avatar_url" && value) {
      setPreviewImage(value)
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Crear URL para previsualización
    const objectUrl = URL.createObjectURL(file)
    setPreviewImage(objectUrl)

    // Subir imagen
    try {
      setUploadingImage(true)

      toast({
        title: "Subiendo imagen...",
        description: "Por favor espera mientras se sube tu imagen",
      })

      const result = await storageService.uploadProfileImage(file, user.id)

      // Actualizar URL en el formulario
      setFormData((prev) => ({
        ...prev,
        avatar_url: result.url,
      }))

      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido correctamente",
      })
    } catch (error) {
      console.error("Error al subir imagen:", error)
      toast({
        title: "Error al subir imagen",
        description: error instanceof Error ? error.message : "No se pudo subir la imagen. Por favor intenta de nuevo.",
        variant: "destructive",
      })
      // Restaurar avatar anterior si hay error
      setPreviewImage(formData.avatar_url || null)
    } finally {
      setUploadingImage(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setPreviewImage(null)
    setFormData((prev) => ({
      ...prev,
      avatar_url: "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    // Validar que el nombre completo no esté vacío
    if (!formData.full_name.trim()) {
      toast({
        title: "Error de validación",
        description: "El nombre completo es requerido",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Preparar datos asegurando que email siempre esté presente
      const updateData = {
        id: user.id,
        email: user.email, // Siempre usar el email del usuario autenticado
        full_name: formData.full_name.trim(),
        username: formData.username.trim() || null,
        avatar_url: formData.avatar_url || null,
        phone: formData.phone.trim() || null,
        birth_date: formData.birth_date || null,
        updated_at: new Date().toISOString(),
      }

      // Solo agregar campos opcionales si tienen valor
      if (formData.gender) {
        updateData.gender = formData.gender
      }
      if (formData.bio.trim()) {
        updateData.bio = formData.bio.trim()
      }
      if (formData.location.trim()) {
        updateData.location = formData.location.trim()
      }

      console.log("Updating profile with data:", updateData)

      // Actualizar o crear perfil en Supabase
      const { error } = await supabase.from("profiles").upsert(updateData, {
        onConflict: "id",
      })

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      // Actualizar el contexto de usuario
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          full_name: formData.full_name,
        },
      })

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado exitosamente",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error al actualizar",
        description:
          error instanceof Error ? error.message : "No se pudo actualizar el perfil. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Información del Perfil</h2>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos Personales</CardTitle>
            <CardDescription>Actualiza tu información personal</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Sección de Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-2 border-primary/20">
                    <AvatarImage src={previewImage || undefined} alt={formData.full_name} />
                    <AvatarFallback className="text-3xl bg-primary/10">
                      {formData.full_name ? getInitials(formData.full_name) : <User />}
                    </AvatarFallback>
                  </Avatar>

                  {/* Overlay con botones */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full"
                        onClick={triggerFileInput}
                        disabled={uploadingImage}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      {previewImage && (
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8 rounded-full"
                          onClick={removeImage}
                          disabled={uploadingImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Indicador de carga */}
                  {uploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploadingImage}
                />

                <div className="text-center">
                  <h3 className="font-medium">{formData.full_name || formData.username || "Usuario"}</h3>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                </div>
              </div>

              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="upload">Subir Imagen</TabsTrigger>
                  <TabsTrigger value="url">URL de Imagen</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-2">
                  <div
                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={triggerFileInput}
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">Haz clic para seleccionar una imagen</p>
                    <p className="text-sm text-muted-foreground">O arrastra y suelta aquí</p>
                    <p className="text-xs text-muted-foreground mt-2">PNG, JPG o GIF. Máximo 5MB.</p>
                  </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-2">
                  <Label htmlFor="avatar_url">URL de Foto de Perfil</Label>
                  <Input
                    id="avatar_url"
                    name="avatar_url"
                    placeholder="https://ejemplo.com/avatar.jpg"
                    value={formData.avatar_url}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">Ingresa la URL de una imagen existente en internet</p>
                </TabsContent>
              </Tabs>

              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre Completo *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="@usuario"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} disabled />
                <p className="text-sm text-muted-foreground">Tu email no se puede cambiar</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+52 123 456 7890"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="birth_date"
                      name="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Femenino</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefiero no decir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ciudad, País"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Cuéntanos un poco sobre ti..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">{formData.bio.length}/200 caracteres</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading || uploadingImage}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contraseña</CardTitle>
            <CardDescription>Cambiar tu contraseña</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Los cambios de contraseña se gestionan a través de la autenticación de Supabase. Para cambiar tu
              contraseña, utiliza la opción 'Olvidé mi contraseña' en la página de inicio de sesión.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <a href="/auth/login">Ir a Página de Inicio de Sesión</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

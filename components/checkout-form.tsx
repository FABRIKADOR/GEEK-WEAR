"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import supabase from "@/lib/supabase"

// Estados de México
const MEXICAN_STATES = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
]

interface CheckoutFormProps {
  onSubmit: (data: any) => void
  setIsValid: (isValid: boolean) => void
}

export function CheckoutForm({ onSubmit, setIsValid }: CheckoutFormProps) {
  const { toast } = useToast()
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [user, setUser] = useState(null)
  const [errors, setErrors] = useState<any>({})
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Estados del formulario
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    saveAddress: false,
  })

  // Validar formulario
  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres"
    }
    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres"
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "El teléfono debe tener al menos 10 dígitos"
    }
    if (!formData.streetAddress || formData.streetAddress.length < 5) {
      newErrors.streetAddress = "La dirección debe tener al menos 5 caracteres"
    }
    if (!formData.city || formData.city.length < 2) {
      newErrors.city = "La ciudad debe tener al menos 2 caracteres"
    }
    if (!formData.state) {
      newErrors.state = "Selecciona un estado"
    }
    if (!formData.postalCode || formData.postalCode.length !== 5) {
      newErrors.postalCode = "Código postal inválido"
    }

    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0
    setIsValid(isValid)
    return isValid
  }

  // Actualizar campo del formulario
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Validar cuando cambien los datos
  useEffect(() => {
    validateForm()
  }, [formData])

  // Cargar usuario y direcciones guardadas
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoadingData(true)
        console.log("Iniciando carga de datos del usuario...")

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("Error obteniendo usuario:", userError)
          return
        }

        if (!user) {
          console.log("No hay usuario autenticado")
          return
        }

        console.log("Usuario encontrado:", user.email)
        setUser(user)

        // Intentar cargar direcciones guardadas
        try {
          console.log("Cargando direcciones guardadas...")
          const { data: addresses, error: addressError } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("is_default", { ascending: false })

          if (addressError) {
            console.log("Error cargando direcciones (puede ser normal si no existen):", addressError.message)
          } else if (addresses && addresses.length > 0) {
            console.log("Direcciones encontradas:", addresses.length)
            setSavedAddresses(addresses)

            // Si hay una dirección por defecto, usarla
            const defaultAddress = addresses.find((addr) => addr.is_default)
            if (defaultAddress) {
              console.log("Usando dirección por defecto")
              setFormData({
                firstName: defaultAddress.first_name || "",
                lastName: defaultAddress.last_name || "",
                email: defaultAddress.email || user.email || "",
                phone: defaultAddress.phone || "",
                streetAddress: defaultAddress.street_address || "",
                city: defaultAddress.city || "",
                state: defaultAddress.state || "",
                postalCode: defaultAddress.postal_code || "",
                saveAddress: false,
              })
              setSelectedAddressId(defaultAddress.id!)
              return
            }
          }
        } catch (addressError) {
          console.log("Error al cargar direcciones:", addressError)
        }

        // Si no hay dirección por defecto, intentar cargar datos del perfil
        try {
          console.log("Cargando datos del perfil...")
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (profileError) {
            console.log("Error cargando perfil (puede ser normal si no existe):", profileError.message)
          } else if (profile) {
            console.log("Perfil encontrado, usando datos del perfil")
            setFormData((prev) => ({
              ...prev,
              firstName: profile.first_name || extractFirstName(user) || "",
              lastName: profile.last_name || extractLastName(user) || "",
              email: user.email || "",
              phone: profile.phone || "",
            }))
            return
          }
        } catch (profileError) {
          console.log("Error al cargar perfil:", profileError)
        }

        // Fallback: usar solo datos básicos del usuario
        console.log("Usando datos básicos del usuario")
        setFormData((prev) => ({
          ...prev,
          firstName: extractFirstName(user) || "",
          lastName: extractLastName(user) || "",
          email: user.email || "",
        }))
      } catch (error) {
        console.error("Error general cargando datos del usuario:", error)
      } finally {
        setIsLoadingData(false)
        console.log("Carga de datos completada")
      }
    }

    loadUserData()
  }, [])

  // Funciones auxiliares para extraer nombre de los metadatos de Google
  const extractFirstName = (user: any) => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ")[0]
    }
    if (user.user_metadata?.name) {
      return user.user_metadata.name.split(" ")[0]
    }
    if (user.user_metadata?.given_name) {
      return user.user_metadata.given_name
    }
    return ""
  }

  const extractLastName = (user: any) => {
    if (user.user_metadata?.full_name) {
      const parts = user.user_metadata.full_name.split(" ")
      return parts.slice(1).join(" ")
    }
    if (user.user_metadata?.name) {
      const parts = user.user_metadata.name.split(" ")
      return parts.slice(1).join(" ")
    }
    if (user.user_metadata?.family_name) {
      return user.user_metadata.family_name
    }
    return ""
  }

  const handleAddressSelect = (addressId: string) => {
    if (addressId === "new") {
      setFormData({
        firstName: extractFirstName(user) || "",
        lastName: extractLastName(user) || "",
        email: user?.email || "",
        phone: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        saveAddress: false,
      })
      setSelectedAddressId("")
      return
    }

    const address = savedAddresses.find((addr) => addr.id === addressId)
    if (address) {
      setFormData({
        firstName: address.first_name,
        lastName: address.last_name,
        email: address.email,
        phone: address.phone,
        streetAddress: address.street_address,
        city: address.city,
        state: address.state,
        postalCode: address.postal_code,
        saveAddress: false,
      })
      setSelectedAddressId(addressId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        variant: "destructive",
      })
      return
    }

    try {
      // Guardar dirección si el usuario lo solicita
      if (formData.saveAddress && user) {
        const { error } = await supabase.from("addresses").insert({
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street_address: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: "México",
          is_default: savedAddresses.length === 0, // Primera dirección es por defecto
        })

        if (!error) {
          toast({
            title: "Dirección guardada",
            description: "Tu dirección ha sido guardada para futuras compras",
          })
        }
      }

      onSubmit(formData)
    } catch (error) {
      console.error("Error guardando dirección:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al guardar la dirección",
        variant: "destructive",
      })
    }
  }

  // Mostrar loading mientras se cargan los datos
  if (isLoadingData) {
    return (
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">Cargando información del usuario...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Información de Envío</h3>

      {/* Direcciones guardadas */}
      {savedAddresses.length > 0 && (
        <div className="mb-6">
          <Label className="text-sm font-medium">Direcciones guardadas</Label>
          <Select value={selectedAddressId} onValueChange={handleAddressSelect}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecciona una dirección guardada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Nueva dirección</SelectItem>
              {savedAddresses.map((address) => (
                <SelectItem key={address.id} value={address.id}>
                  {address.first_name} {address.last_name} - {address.street_address}, {address.city}
                  {address.is_default && " (Predeterminada)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              placeholder="Juan"
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <Label htmlFor="lastName">Apellidos</Label>
            <Input
              id="lastName"
              placeholder="Pérez García"
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="juan@ejemplo.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              placeholder="5512345678"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="streetAddress">Dirección</Label>
          <Input
            id="streetAddress"
            placeholder="Av. Insurgentes Sur 123, Col. Roma Norte"
            value={formData.streetAddress}
            onChange={(e) => updateField("streetAddress", e.target.value)}
            className={errors.streetAddress ? "border-red-500" : ""}
          />
          {errors.streetAddress && <p className="text-sm text-red-500 mt-1">{errors.streetAddress}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              placeholder="Ciudad de México"
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
          </div>

          <div>
            <Label htmlFor="state">Estado</Label>
            <Select value={formData.state} onValueChange={(value) => updateField("state", value)}>
              <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {MEXICAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
          </div>

          <div>
            <Label htmlFor="postalCode">Código Postal</Label>
            <Input
              id="postalCode"
              placeholder="06700"
              value={formData.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value)}
              maxLength={5}
              className={errors.postalCode ? "border-red-500" : ""}
            />
            {errors.postalCode && <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="saveAddress"
            checked={formData.saveAddress}
            onCheckedChange={(checked) => updateField("saveAddress", checked)}
          />
          <Label htmlFor="saveAddress">Guardar esta dirección para futuras compras</Label>
        </div>

        {/* Botón oculto para envío del formulario */}
        <Button type="submit" className="hidden">
          Enviar
        </Button>
      </form>
    </div>
  )
}

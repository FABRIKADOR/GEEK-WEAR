"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserAddresses } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddressForm } from "@/components/address-form"
import type { Address } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export default function AddressesPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return

      try {
        const addressesData = await getUserAddresses(user.id)
        setAddresses(addressesData)
      } catch (error) {
        console.error("Error fetching addresses:", error)
        toast({
          title: "Error",
          description: "Failed to load addresses",
          variant: "destructive",
        })
        toast({
          title: "Error",
          description: "Error al cargar las direcciones",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [user, toast])

  const handleAddAddress = () => {
    setEditingAddress(null)
    setShowAddForm(true)
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setShowAddForm(true)
  }

  const handleDeleteAddress = async (addressId: string) => {
    // This would be implemented with a delete function in the database service
    toast({
      title: "Not implemented",
      description: "Address deletion is not implemented in this demo",
    })
    toast({
      title: "No implementado",
      description: "La eliminación de direcciones no está implementada en esta demo",
    })
  }

  const handleFormCancel = () => {
    setShowAddForm(false)
    setEditingAddress(null)
  }

  const handleFormSubmit = async (address: Partial<Address>) => {
    // This would be implemented with create/update functions in the database service
    toast({
      title: "Not implemented",
      description: "Address saving is not implemented in this demo",
    })
    toast({
      title: "No implementado",
      description: "El guardado de direcciones no está implementado en esta demo",
    })
    setShowAddForm(false)
    setEditingAddress(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (showAddForm) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">{editingAddress ? "Edit Address" : "Add New Address"}</h2>
        <h2 className="text-2xl font-bold mb-6">{editingAddress ? "Editar Dirección" : "Agregar Nueva Dirección"}</h2>
        <AddressForm address={editingAddress} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <h2 className="text-2xl font-bold">Mis Direcciones</h2>
        <Button onClick={handleAddAddress}>
          <Plus className="mr-2 h-4 w-4" />
          Add Address Agregar Dirección
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="mb-4">You haven't added any addresses yet.</p>
            <p className="mb-4">Aún no has agregado ninguna dirección.</p>
            <Button onClick={handleAddAddress}>Add Your First Address</Button>
            <Button onClick={handleAddAddress}>Agrega tu Primera Dirección</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {address.address_line1}
                    {address.is_default && (
                      <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">Default</Badge>
                    )}
                    {address.is_default && (
                      <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">Predeterminada</Badge>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p>{address.country}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleEditAddress(address)}>
                  <Pencil className="mr-1 h-4 w-4" />
                  Edit Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

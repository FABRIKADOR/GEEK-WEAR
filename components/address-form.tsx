"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { Address } from "@/types"

interface AddressFormProps {
  address: Address | null
  onSubmit: (address: Partial<Address>) => void
  onCancel: () => void
}

export function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    address_line1: address?.address_line1 || "",
    address_line2: address?.address_line2 || "",
    city: address?.city || "",
    state: address?.state || "",
    postal_code: address?.postal_code || "",
    country: address?.country || "",
    is_default: address?.is_default || false,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_default: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsLoading(true)

    const addressData = {
      ...formData,
      id: address?.id,
      user_id: user.id,
    }

    onSubmit(addressData)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address_line1">
              Dirección Línea 1 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address_line1"
              name="address_line1"
              value={formData.address_line1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line2">Dirección Línea 2</Label>
            <Input id="address_line2" name="address_line2" value={formData.address_line2} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                Ciudad <span className="text-red-500">*</span>
              </Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">
                Estado/Provincia <span className="text-red-500">*</span>
              </Label>
              <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal_code">
                Código Postal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">
                País <span className="text-red-500">*</span>
              </Label>
              <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch id="is_default" checked={formData.is_default} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="is_default">Establecer como dirección predeterminada</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Dirección"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

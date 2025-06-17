"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Métodos de envío para México
const SHIPPING_METHODS = [
  {
    id: "standard",
    name: "Envío Estándar",
    price: 99,
    estimatedDelivery: "5-7 días hábiles",
    description: "Envío nacional por paquetería",
  },
  {
    id: "express",
    name: "Envío Express",
    price: 199,
    estimatedDelivery: "2-3 días hábiles",
    description: "Envío rápido por DHL/FedEx",
  },
  {
    id: "same_day",
    name: "Entrega el mismo día",
    price: 299,
    estimatedDelivery: "Mismo día (CDMX y área metropolitana)",
    description: "Solo disponible en Ciudad de México",
  },
]

interface ShippingMethodProps {
  onChange: (method: any) => void
  selectedMethod: any
}

export function ShippingMethod({ onChange, selectedMethod }: ShippingMethodProps) {
  return (
    <RadioGroup
      defaultValue={selectedMethod.id}
      onValueChange={(value) => {
        const method = SHIPPING_METHODS.find((m) => m.id === value)
        if (method) {
          onChange(method)
        }
      }}
    >
      {SHIPPING_METHODS.map((method) => (
        <div
          key={method.id}
          className={`flex items-center justify-between p-4 rounded-lg border ${
            selectedMethod.id === method.id ? "border-primary bg-primary/5" : ""
          } mb-3 last:mb-0`}
        >
          <div className="flex items-start gap-3">
            <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
            <div>
              <Label htmlFor={method.id} className="font-medium">
                {method.name}
              </Label>
              <p className="text-sm text-muted-foreground">{method.estimatedDelivery}</p>
              <p className="text-xs text-muted-foreground">{method.description}</p>
            </div>
          </div>
          <div className="font-medium">${method.price} MXN</div>
        </div>
      ))}
    </RadioGroup>
  )
}

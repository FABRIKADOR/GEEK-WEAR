"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CreditCard, Lock } from "lucide-react"

const formSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: "El número de tarjeta debe tener al menos 16 dígitos" })
    .max(19, { message: "El número de tarjeta no debe exceder 19 dígitos" })
    .regex(/^[0-9\s-]+$/, { message: "Número de tarjeta inválido" }),
  cardName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Formato inválido. Usa MM/YY" }),
  cvv: z
    .string()
    .min(3, { message: "El CVV debe tener al menos 3 dígitos" })
    .max(4, { message: "El CVV no debe exceder 4 dígitos" })
    .regex(/^[0-9]+$/, { message: "CVV inválido" }),
})

type FormValues = z.infer<typeof formSchema>

interface PaymentMethodProps {
  onSubmit: (data: FormValues) => void
  initialValues?: Partial<FormValues>
  setIsValid: (isValid: boolean) => void
}

export function PaymentMethod({ onSubmit, initialValues, setIsValid }: PaymentMethodProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: initialValues?.cardNumber || "",
      cardName: initialValues?.cardName || "",
      expiryDate: initialValues?.expiryDate || "",
      cvv: initialValues?.cvv || "",
    },
    mode: "onChange",
  })

  const { formState } = form

  useEffect(() => {
    setIsValid(formState.isValid)
  }, [formState.isValid, setIsValid])

  const handleSubmit = (data: FormValues) => {
    onSubmit(data)
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Método de Pago</h3>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-primary" />
          <span className="font-medium">Tarjeta de Crédito/Débito</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
            <span className="font-bold text-xs">VISA</span>
          </div>
          <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
            <span className="font-bold text-xs">MC</span>
          </div>
          <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
            <span className="font-bold text-xs">AMEX</span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Tarjeta</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value)
                      field.onChange(formatted)
                    }}
                    maxLength={19}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre en la Tarjeta</FormLabel>
                <FormControl>
                  <Input placeholder="JUAN PEREZ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Expiración</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MM/YY"
                      {...field}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value)
                        field.onChange(formatted)
                      }}
                      maxLength={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} type="password" maxLength={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center text-sm text-muted-foreground mt-4">
            <Lock className="h-4 w-4 mr-2" />
            <p>Tus datos de pago están seguros. Utilizamos encriptación de 256 bits.</p>
          </div>
        </form>
      </Form>
    </div>
  )
}

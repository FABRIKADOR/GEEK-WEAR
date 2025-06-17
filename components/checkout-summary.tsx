import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingBag } from "lucide-react"

interface CheckoutSummaryProps {
  cart: any
  shippingCost: number
}

export function CheckoutSummary({ cart, shippingCost }: CheckoutSummaryProps) {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const total = cart.total + shippingCost

  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

        <ScrollArea className="h-[250px] pr-4 -mr-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex py-3 first:pt-0 border-b last:border-0">
              <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border">
                <Image
                  src={
                    item.product.images && item.product.images[0]?.url
                      ? item.product.images[0].url
                      : `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(item.product.name)}`
                  }
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                {item.variant && (
                  <p className="text-xs text-muted-foreground">
                    {item.variant.size} / {item.variant.color}
                  </p>
                )}
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.product.price + (item.variant?.price_adjustment || 0))} x {item.quantity}
                  </p>
                  <p className="text-sm font-medium">
                    {formatPrice((item.product.price + (item.variant?.price_adjustment || 0)) * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="space-y-3 mt-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>

          {cart.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Descuento</span>
              <span>-{formatPrice(cart.discount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Envío</span>
            <span>{formatPrice(shippingCost)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-muted/50">
        <div className="w-full flex items-center justify-center text-sm text-muted-foreground">
          <ShoppingBag className="h-4 w-4 mr-2" />
          <span>
            {cart.items.length} {cart.items.length === 1 ? "producto" : "productos"}
          </span>
          <span className="mx-2">•</span>
          <Link href="/cart" className="text-primary hover:underline">
            Editar carrito
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/cart"

// Asegúrate de importar cualquier otro componente o utilidad que necesites

export function CartLink() {
  const { cart } = useCartStore()
  const [itemCount, setItemCount] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  // Esto garantiza que el conteo de artículos se actualice solo del lado del cliente
  useEffect(() => {
    setIsMounted(true)
    setItemCount(cart.items.reduce((total, item) => total + item.quantity, 0))
  }, [cart.items])

  // Agregar evento de clic para guardar la URL actual
  const handleCheckoutClick = () => {
    if (cart.items.length > 0) {
      localStorage.setItem("redirectAfterLogin", "/checkout")
    }
  }

  return (
    <Link href="/cart" className="relative" aria-label="Ver carrito">
      <ShoppingBag className="h-6 w-6" />
      {isMounted && itemCount > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {itemCount}
        </span>
      )}
    </Link>
  )
}

"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { secureStorage } from "@/lib/secure-storage"
import type { Product } from "@/types"

interface CartItem {
  id: string
  product: Product
  quantity: number
  size?: string
  color?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Cargar carrito desde almacenamiento seguro
  useEffect(() => {
    const savedCart = secureStorage.getCart()
    if (savedCart) {
      setItems(savedCart)
    }
  }, [])

  // Guardar carrito en almacenamiento seguro cuando cambie
  useEffect(() => {
    secureStorage.setCart(items)
  }, [items])

  const addItem = (product: Product, quantity = 1, size?: string, color?: string) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id && item.size === size && item.color === color,
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === existingItem.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }

      const newItem: CartItem = {
        id: `${product.id}-${size || "default"}-${color || "default"}-${Date.now()}`,
        product,
        quantity,
        size,
        color,
      }

      return [...currentItems, newItem]
    })
  }

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    secureStorage.clearSecureData()
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de un CartProvider")
  }
  return context
}

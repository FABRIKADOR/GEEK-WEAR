"use client"

import { useState, useCallback } from "react"

export function useCartAnimation() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [newItemId, setNewItemId] = useState<string | null>(null)

  const openCartWithAnimation = useCallback((itemId?: string) => {
    if (itemId) {
      setNewItemId(itemId)
    }
    setIsCartOpen(true)

    // Auto-cerrar después de 4 segundos
    setTimeout(() => {
      setIsCartOpen(false)
      setNewItemId(null)
    }, 4000)
  }, [])

  const closeCart = useCallback(() => {
    setIsCartOpen(false)
    setNewItemId(null)
  }, [])

  return {
    isCartOpen,
    newItemId,
    openCartWithAnimation,
    closeCart,
  }
}

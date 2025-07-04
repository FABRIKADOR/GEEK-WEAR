import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Cart, Product, ProductVariant } from "../types"

type CartStore = {
  cart: Cart
  addItem: (product: Product, quantity: number, variant?: ProductVariant) => void
  updateItemQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  applyCoupon: (discount: number) => void
  removeCoupon: () => void
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: initialCart,

      addItem: (product, quantity, variant) => {
        const currentCart = get().cart
        const existingItemIndex = currentCart.items.findIndex(
          (item) => item.product_id === product.id && (!variant || item.variant_id === variant?.id),
        )

        const newItems = [...currentCart.items]

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity,
          }
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}${variant ? `-${variant.id}` : ""}-${Date.now()}`,
            product_id: product.id,
            variant_id: variant?.id,
            quantity,
            product,
            variant,
          }
          newItems.push(newItem)
        }

        const subtotal = calculateSubtotal(newItems)
        const discount = currentCart.discount

        set({
          cart: {
            items: newItems,
            subtotal,
            discount,
            total: subtotal - discount,
          },
        })
      },

      updateItemQuantity: (itemId, quantity) => {
        const currentCart = get().cart

        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          return get().removeItem(itemId)
        }

        const newItems = currentCart.items.map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity }
          }
          return item
        })

        const subtotal = calculateSubtotal(newItems)
        const discount = currentCart.discount

        set({
          cart: {
            items: newItems,
            subtotal,
            discount,
            total: subtotal - discount,
          },
        })
      },

      removeItem: (itemId) => {
        const currentCart = get().cart
        const newItems = currentCart.items.filter((item) => item.id !== itemId)

        const subtotal = calculateSubtotal(newItems)
        const discount = currentCart.discount

        set({
          cart: {
            items: newItems,
            subtotal,
            discount,
            total: subtotal - discount,
          },
        })
      },

      clearCart: () => {
        set({ cart: initialCart })
      },

      applyCoupon: (discount) => {
        const currentCart = get().cart

        set({
          cart: {
            ...currentCart,
            discount,
            total: currentCart.subtotal - discount,
          },
        })
      },

      removeCoupon: () => {
        const currentCart = get().cart

        set({
          cart: {
            ...currentCart,
            discount: 0,
            total: currentCart.subtotal,
          },
        })
      },
    }),
    {
      name: "geekwear-cart",
    },
  ),
)

// Helper function to calculate subtotal
function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const basePrice = item.product.price
    const variantAdjustment = item.variant?.price_adjustment || 0
    return sum + (basePrice + variantAdjustment) * item.quantity
  }, 0)
}

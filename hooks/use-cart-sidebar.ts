"use client"

import { create } from "zustand"

interface CartSidebarState {
  isOpen: boolean
  isAnimating: boolean
  justAdded: string | null
  openCart: (itemId?: string) => void
  closeCart: () => void
  setAnimating: (animating: boolean) => void
  clearJustAdded: () => void
}

export const useCartSidebar = create<CartSidebarState>((set) => ({
  isOpen: false,
  isAnimating: false,
  justAdded: null,
  openCart: (itemId) => set({ isOpen: true, justAdded: itemId || null }),
  closeCart: () => set({ isOpen: false, justAdded: null }),
  setAnimating: (animating) => set({ isAnimating: animating }),
  clearJustAdded: () => set({ justAdded: null }),
}))
